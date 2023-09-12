import { faker } from '@faker-js/faker'
import { http } from 'msw'
import * as setCookieParser from 'set-cookie-parser'
import { expect, test } from 'vitest'
import { connectionSessionStorage } from '#app/utils/connections.server.ts'
import { invariant } from '#app/utils/misc.tsx'
import { server } from '#tests/mocks/index.ts'
import { consoleError } from '#tests/setup/setup-test-env.ts'
import { loader } from './auth.$provider.callback.ts'

const ROUTE_PATH = '/auth/github/callback'
const PARAMS = { provider: 'github' }
const BASE_URL = 'https://www.epicstack.dev'

// 🐨 add some cleanup for the github users that are inserted during the tests:
// use deleteGitHubUsers from '#tests/mocks/github.ts' in an afterEach

// 🐨 add some cleanup for our own users that are inserted during the tests:
// use insertedUsers from '#tests/db-utils.ts' and make sure to clear it after
// deleting the users.
// 💰 if you need a reminder for how we did this in playwright,
// check tests/playwright-utils.ts

test('a new user goes to onboarding', async () => {
	const request = await setupRequest()
	const response = await loader({ request, params: PARAMS, context: {} })
	assertRedirect(response, '/onboarding/github')
})

test('when auth fails, send the user to login with a toast', async () => {
	consoleError.mockImplementation(() => {})
	server.use(
		http.post('https://github.com/login/oauth/access_token', async () => {
			return new Response('error', { status: 400 })
		}),
	)
	const request = await setupRequest()
	const response = await loader({ request, params: PARAMS, context: {} }).catch(
		e => e,
	)
	invariant(response instanceof Response, 'response should be a Response')
	assertRedirect(response, '/login')
	assertToastSent(response)
	expect(consoleError).toHaveBeenCalledTimes(1)
})

test('when a user is logged in, it creates the connection', async () => {
	// 🐨 create a new github user with insertGitHubUser from '#tests/mocks/github.ts'
	// 🐨 create a new user (use our insertNewUser util from '#tests/db-utils.ts')
	// 🐨 create a new session that's connected to that user

	// 🐨 pass the session.id and githubUser.code to the setupRequest function
	// then go below to handle that
	const request = await setupRequest()
	const response = await loader({ request, params: PARAMS, context: {} })
	assertRedirect(response, '/settings/profile/connections')
	assertToastSent(response)

	// 🐨 look in prisma.connection for the connection that should have been
	// created for the user.id + the githubUser.profile.id
	// 🐨 assert the connection exists
})

// 🐨 accept an (optional) sessionId and optional code as an argument here
async function setupRequest() {
	const url = new URL(ROUTE_PATH, BASE_URL)
	const state = faker.string.uuid()
	// 🐨 the code comes in as an argument now, but we should still default the
	// code to faker.string.uuid()
	const code = faker.string.uuid()
	url.searchParams.set('state', state)
	url.searchParams.set('code', code)
	const cookieSession = await connectionSessionStorage.getSession()
	cookieSession.set('oauth2:state', state)
	// 🐨 if there is a sessionId, then set it into the cookieSession under the
	// sessionKey property (💰 sessionKey should come from #app/utils/auth.server.ts)
	const setCookieHeader =
		await connectionSessionStorage.commitSession(cookieSession)
	const request = new Request(url.toString(), {
		method: 'GET',
		headers: { cookie: convertSetCookieToCookie(setCookieHeader) },
	})
	return request
}

function assertToastSent(response: Response) {
	const setCookie = response.headers.get('set-cookie')
	invariant(setCookie, 'set-cookie header should be set')
	const parsedCookie = setCookieParser.splitCookiesString(setCookie)
	expect(parsedCookie).toEqual(
		expect.arrayContaining([expect.stringContaining('en_toast')]),
	)
}

function assertRedirect(response: Response, redirectTo: string) {
	expect(response.status).toBeGreaterThanOrEqual(300)
	expect(response.status).toBeLessThan(400)
	expect(response.headers.get('location')).toBe(redirectTo)
}

function convertSetCookieToCookie(setCookie: string) {
	const parsedCookie = setCookieParser.parseString(setCookie)
	return new URLSearchParams({
		[parsedCookie.name]: parsedCookie.value,
	}).toString()
}
