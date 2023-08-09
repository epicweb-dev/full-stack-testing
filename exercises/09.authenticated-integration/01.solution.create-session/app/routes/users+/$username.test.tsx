/**
 * @vitest-environment jsdom
 */
import { faker } from '@faker-js/faker'
import { json } from '@remix-run/node'
import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { type loader as rootLoader } from '~/root.tsx'
import { default as UsernameRoute, type loader } from './$username.tsx'

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
	const App = createRemixStub([
		{
			path: '/users/:username',
			element: <UsernameRoute />,
			loader(): Awaited<ReturnType<typeof loader>> {
				return json({
					user,
					userJoinedDisplay: user.createdAt.toLocaleDateString(),
				})
			},
		},
	])

	const routeUrl = `/users/${user.username}`
	render(<App initialEntries={[routeUrl]} />)

	await screen.findByRole('heading', { level: 1, name: user.name })
	await screen.findByRole('img', { name: user.name })
	await screen.findByRole('link', { name: `${user.name}'s notes` })
})

test('The user profile when logged in as self', async () => {
	const user = createFakeUser()
	const App = createRemixStub([
		{
			id: 'root',
			path: '/',
			loader(): Awaited<ReturnType<typeof rootLoader>> {
				return json({
					ENV: { MODE: 'test' },
					theme: 'light',
					username: 'testuser',
					toast: null,
					user: {
						...user,
						roles: [],
					},
				})
			},
			children: [
				{
					path: 'users/:username',
					element: <UsernameRoute />,
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
	render(<App initialEntries={[routeUrl]} />)

	await screen.findByRole('heading', { level: 1, name: user.name })
	await screen.findByRole('img', { name: user.name })
	await screen.findByRole('button', { name: /logout/i })
	await screen.findByRole('link', { name: /my notes/i })
	await screen.findByRole('link', { name: /edit profile/i })
})
