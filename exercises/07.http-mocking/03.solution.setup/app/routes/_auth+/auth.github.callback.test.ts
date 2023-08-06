import { faker } from '@faker-js/faker'
import { rest } from 'msw'
import * as setCookieParser from 'set-cookie-parser'
import { server } from 'tests/mocks/index.ts'
import { consoleError } from 'tests/setup/setup-test-env.ts'
import { afterEach, expect, test } from 'vitest'
import { invariant } from '~/utils/misc.tsx'
import { sessionStorage } from '~/utils/session.server.ts'
import { ROUTE_PATH, loader } from './auth.github.callback.ts'

const BASE_URL = 'https://www.epicstack.dev'
const RESOURCE_URL_STRING = `${BASE_URL}${ROUTE_PATH}`

afterEach(() => {
	server.resetHandlers()
})

test('a new user goes to onboarding', async () => {
	const request = await setupRequest()
	const response = await loader({ request, params: {}, context: {} })
	expect(response.status).toBe(302)
	expect(response.headers.get('location')).toBe('/onboarding/github')
})

test('when auth fails, send the user to login with a toast', async () => {
	server.use(
		rest.post('https://github.com/login/oauth/access_token', async () => {
			return new Response('error', { status: 400 })
		}),
	)
	const request = await setupRequest()
	const response = await loader({ request, params: {}, context: {} }).catch(
		e => e,
	)
	invariant(response instanceof Response, 'response should be a Response')
	expect(response.status).toBe(302)
	expect(response.headers.get('location')).toBe('/login')
	assertToastSent(response)
	expect(consoleError).toHaveBeenCalledTimes(1)
	consoleError.mockClear()
})

async function setupRequest() {
	const url = new URL(RESOURCE_URL_STRING)
	const state = faker.string.uuid()
	const code = faker.string.uuid()
	url.searchParams.set('state', state)
	url.searchParams.set('code', code)
	const cookieSession = await sessionStorage.getSession()
	cookieSession.set('oauth2:state', state)
	const setCookieHeader = await sessionStorage.commitSession(cookieSession)
	const request = new Request(url.toString(), {
		method: 'GET',
		headers: { cookie: convertSetCookieToCookie(setCookieHeader) },
	})
	return request
}

// we're going to improve this later
function assertToastSent(response: Response) {
	const setCookie = response.headers.get('set-cookie')
	invariant(setCookie, 'set-cookie header should be set')
	const parsedCookie = setCookieParser.splitCookiesString(setCookie)
	expect(parsedCookie).toEqual(
		expect.arrayContaining([expect.stringContaining('en_toast')]),
	)
}

function convertSetCookieToCookie(setCookie: string) {
	const parsedCookie = setCookieParser.parseString(setCookie)
	return new URLSearchParams({
		[parsedCookie.name]: parsedCookie.value,
	}).toString()
}
