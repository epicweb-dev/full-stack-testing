/**
 * @vitest-environment jsdom
 */
import { faker } from '@faker-js/faker'
// 💣 we're not going to need to make our own responses anymore, you can remove this:
import { json } from '@remix-run/node'
import { createRemixStub } from '@remix-run/testing'
// 💰 you'll need these:
// import * as setCookieParser from 'set-cookie-parser'
// import { getUserImages, insertNewUser } from '#tests/db-utils.ts'
import { render, screen } from '@testing-library/react'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
// 💰 you'll need this:
// import * as setCookieParser from 'set-cookie-parser'
import { test } from 'vitest'
// 🐨 remove the "type" from here. We're bringing in the real deal!
import { type loader as rootLoader } from '#app/root.tsx'
// 💰 you're going to need these to make the session:
// import { sessionKey, getSessionExpirationDate } from '#app/utils/auth.server.ts'
// 💰 and while I'm giving you all this stuff, I may as well give you prisma too
// import { prisma } from '#app/utils/db.server.ts'
// 💰 you're also going to need sessionStorage:
// import { sessionStorage } from '#app/utils/session.server.ts'
import { honeypot } from '#app/utils/honeypot.server.ts'
// 🐨 remove the "type" from here too:
import { default as UsernameRoute, type loader } from './$username.tsx'
// 💣 we can delete this, we'll be doing something else below...
function createFakeUser() {
	const user = {
		id: faker.string.uuid(),
		name: faker.person.fullName(),
		username: faker.internet.userName(),
		createdAt: faker.date.past(),
		image: {
			id: faker.string.uuid(),
		},
	}
	return user
}

test('The user profile when not logged in as self', async () => {
	// 🐨 create a new user in the database using insertNewUser
	// Because we want to test the user's photo, we need to update our user to have
	// a photo.
	// 🐨 get a user image from "getUserImages()" and pick one of them to update
	// the user with an image.
	// 💰 data: { image: { create: userImage } },
	const user = createFakeUser()
	const App = createRemixStub([
		{
			path: '/users/:username',
			Component: UsernameRoute,
			// 🐨 replace this fake loader with the real one. That's it for this test!
			loader(): Awaited<ReturnType<typeof loader>> {
				return json({
					user,
					userJoinedDisplay: user.createdAt.toLocaleDateString(),
				})
			},
		},
	])

	const routeUrl = `/users/${user.username}`
	await render(<App initialEntries={[routeUrl]} />, {
		wrapper: ({ children }) => (
			<AuthenticityTokenProvider token="test-csrf-token">
				{children}
			</AuthenticityTokenProvider>
		),
	})

	await screen.findByRole('heading', { level: 1, name: user.name })
	await screen.findByRole('img', { name: user.name })
	await screen.findByRole('link', { name: `${user.name}'s notes` })
})

test('The user profile when logged in as self', async () => {
	// 🐨 insert a new user and set them up with an image like in the previous test
	// 🐨 create a new session for the user

	// Now for the authenticated part! Here we go:
	// 🐨 get a cookieSession from sessionStorage.getSession
	// 🐨 set the sessionKey to the session.id
	// 🐨 get the setCookie header from sessionStorage.commitSession
	// 🐨 parse the cookie using setCookieParser.parseString
	// 🐨 turn that parsed cookie into a cookieHeader:
	// 💰 new URLSearchParams({ [parsedCookie.name]: parsedCookie.value })
	const user = createFakeUser()
	const App = createRemixStub([
		{
			id: 'root',
			path: '/',
			// 🐨 replace this with a smaller one that takes the request, sets the
			// cookie header and then calls the rootLoader directly
			loader(): Awaited<ReturnType<typeof rootLoader>> {
				const honeyProps = honeypot.getInputProps()
				return json({
					ENV: { MODE: 'test' },
					theme: 'light',
					username: 'testuser',
					toast: null,
					user: {
						...user,
						roles: [],
					},
					csrfToken: 'test-csrf-token',
					honeyProps,
				})
			},
			children: [
				{
					path: 'users/:username',
					Component: UsernameRoute,
					// 🐨 replace this with a smaller one that takes the request, sets the
					// cookie header and then calls the rootLoader directly
					loader(): Awaited<ReturnType<typeof loader>> {
						return json({
							user,
							userJoinedDisplay: user.createdAt.toLocaleDateString(),
						})
					},
				},
			],
		},
	])

	const routeUrl = `/users/${user.username}`
	await render(<App initialEntries={[routeUrl]} />, {
		wrapper: ({ children }) => (
			<AuthenticityTokenProvider token="test-csrf-token">
				{children}
			</AuthenticityTokenProvider>
		),
	})

	// 🐨 you'll need to add an invariant on the user.name here to be certain the user.name exists
	await screen.findByRole('heading', { level: 1, name: user.name })
	await screen.findByRole('img', { name: user.name })
	await screen.findByRole('button', { name: /logout/i })
	await screen.findByRole('link', { name: /my notes/i })
	await screen.findByRole('link', { name: /edit profile/i })
})
