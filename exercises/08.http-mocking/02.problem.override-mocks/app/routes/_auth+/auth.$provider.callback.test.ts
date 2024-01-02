import { faker } from '@faker-js/faker'
import * as setCookieParser from 'set-cookie-parser'
import { expect, test } from 'vitest'
import { connectionSessionStorage } from '#app/utils/connections.server.ts'
import { invariant } from '#app/utils/misc.tsx'
// 🐨 add { server } to this import:
import '#tests/mocks/index.ts'
import { loader } from './auth.$provider.callback.ts'

const ROUTE_PATH = '/auth/github/callback'
const PARAMS = { provider: 'github' }
const BASE_URL = 'https://www.epicstack.dev'

// 🐨 add afterEach that calls server.resetHandlers

test('a new user goes to onboarding', async () => {
	const url = new URL(ROUTE_PATH, BASE_URL)
	const state = faker.string.uuid()
	const code = faker.string.uuid()
	url.searchParams.set('state', state)
	url.searchParams.set('code', code)

	const connectionSession = await connectionSessionStorage.getSession()
	connectionSession.set('oauth2:state', state)
	const connectionSetCookieHeader =
		await connectionSessionStorage.commitSession(connectionSession)
	const request = new Request(url.toString(), {
		method: 'GET',
		headers: {
			cookie: convertSetCookieToCookie(connectionSetCookieHeader),
		},
	})
	const response = await loader({ request, params: PARAMS, context: {} })
	assertRedirect(response, '/onboarding/github')
})

test('when auth fails, send the user to login with a toast', async () => {
	// 🐨 in the error case, we call console.error, so you can use the consoleError
	// mock we wrote earlier. It's in '#tests/setup/setup-test-env.ts'. With that,
	// add a mock implementation so we don't throw an error, and then we can assert
	// that it was called once at the end of this test.

	// 🐨 add a server.use here for a http.post to 'https://github.com/login/oauth/access_token'
	//   🐨 it should return a response with "error" and a 400 status code
	//   💰 you'll find our happy-path mock implementation of this in '#tests/mocks/github.ts' if you're curious

	// 🦉 this is all the same stuff as the last test:
	const url = new URL(ROUTE_PATH, BASE_URL)
	const state = faker.string.uuid()
	const code = faker.string.uuid()
	url.searchParams.set('state', state)
	url.searchParams.set('code', code)

	const connectionSession = await connectionSessionStorage.getSession()
	connectionSession.set('oauth2:state', state)
	const connectionSetCookieHeader =
		await connectionSessionStorage.commitSession(connectionSession)
	const request = new Request(url.toString(), {
		method: 'GET',
		headers: {
			cookie: convertSetCookieToCookie(connectionSetCookieHeader),
		},
	})
	// 🦉 may be handy to make a utility for this... We'll do that next...

	// 🐨 in the error case, this promise will reject, so you can add a try/catch
	// around it or use .catch to get the response
	await loader({ request, params: PARAMS, context: {} })

	// 🐨 assert a redirect to '/login'
	// 🐨 assert a toast was sent (you can use Kellie's 🧝‍♂️ assertToastSent util below)
	// 🐨 Assert consoleError was called once and make sure to call mockClear on it.
	// expect(consoleError).toHaveBeenCalledTimes(1)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
