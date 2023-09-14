/**
 * @vitest-environment jsdom
 */
import { faker } from '@faker-js/faker'
// 💰 here you go:
// import { createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import { AuthenticityTokenProvider } from 'remix-utils/csrf/react'
import { test } from 'vitest'
// 🦺 bring in the type of loader from here so you can use it in the stub
import { default as UsernameRoute } from './$username.tsx'

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
	const user = createFakeUser()
	// 🐨 create the stub here
	// 🐨 it should have a path of /users/:username
	// 🐨 the element should be <UsernameRoute />
	// 🐨 the loader should follow the pattern in the instructions
	// 🐨 return json with the user and a userJoinedDisplay.
	// 💰 you can reference the actual loader for an example of what this should
	// look like.

	// 🐨 render the App instead of the UsernameRoute here
	await render(<UsernameRoute />, {
		// 🦉 this wrapper is necessary because our UsernameRoute renders the
		// AuthenticityToken and it relies on this provider to render the token.
		wrapper: ({ children }) => (
			<AuthenticityTokenProvider token="test-csrf-token">
				{children}
			</AuthenticityTokenProvider>
		),
	})

	// 🦉 you'll notice we're using findBy queries here which are async. We really
	// only need it for the first one, because we need to wait for Remix to update
	// the screen with the UI. Once the first one's there we know the rest of them
	// will be too. But at this level of testing, it's pretty much best to always
	// use the find* variant of queries because you can't always rely on things
	// being synchronously available.
	await screen.findByRole('heading', { level: 1, name: user.name })
	await screen.findByRole('img', { name: user.name })
	await screen.findByRole('link', { name: `${user.name}'s notes` })
})
