import * as setCookieParser from 'set-cookie-parser'
// 🐨 import the mock server from the mocks folder
// because it starts the server for us automatically, you don't have to worry
// about starting it, and it also handles stopping automatically as well. So
// all you have to do is import the file and you'll be set.
// 💰 import 'tests/mocks/index.ts'
import { test } from 'vitest'
// 🐨 you're going to want sessionStorage from the utils folder
// 💰 import { sessionStorage } from '~/utils/session.server.ts'
// 🐨 you'll need the loader and the loader's ROUTE_PATH from './auth.github.callback.ts'
// 💰 import { ROUTE_PATH, loader } from './auth.github.callback.ts'

// 🐨 declare a BASE_URL variable here to be 'https://www.epicstack.dev'

test('a new user goes to onboarding', async () => {
	// 🐨 create the URL with the ROUTE_PATH and the BASE_URL
	// 💰 tip: new URL('/some/path', 'https://example.com').toString() === 'https://example.com/some/path'
	// 🐨 create the state and code (💰 faker.string.uuid() should work fine)
	// 🐨 set the url.searchParams for `state` and `code`
	// 🐨 get the cookie session from the sessionStorage.getSession() function
	// 🐨 set the 'oauth2:state' value in the cookie session to the `state`
	// 🐨 get a set-cookie header from sessionStorage.commitSession with the cookieSession
	// 🐨 create a new Request with the url.toString().
	//   🐨 the method should be GET (since we're calling the loader)
	//   🐨 the headers should include a cookie, use the convertSetCookieToCookie function below
	// 🐨 call the loader with the request, an empty params object, and an empty context object
	// assert the response is a redirect to `/onboarding/github`
	// 💰 response.headers.get('location') and response.status
})

// 💯 we're going to be asserting redirects a lot, so if you've got extra time
// make a helper function here called assertRedirect that takes a response and
// a redirectTo string. It should assert that the response has a 300 status code
// and that the location header is set to the redirectTo string.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function convertSetCookieToCookie(setCookie: string) {
	const parsedCookie = setCookieParser.parseString(setCookie)
	return new URLSearchParams({
		[parsedCookie.name]: parsedCookie.value,
	}).toString()
}
