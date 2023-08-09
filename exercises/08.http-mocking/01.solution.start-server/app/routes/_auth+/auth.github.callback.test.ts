import { faker } from '@faker-js/faker'
import * as setCookieParser from 'set-cookie-parser'
import 'tests/mocks/index.ts'
import { expect, test } from 'vitest'
import { sessionStorage } from '~/utils/session.server.ts'
import { ROUTE_PATH, loader } from './auth.github.callback.ts'

const BASE_URL = 'https://www.epicstack.dev'

test('a new user goes to onboarding', async () => {
	const url = new URL(ROUTE_PATH, BASE_URL)
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
	const response = await loader({ request, params: {}, context: {} })
	assertRedirect(response, '/onboarding/github')
})

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
