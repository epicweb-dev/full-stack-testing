/**
 * @vitest-environment jsdom
 */
import { faker } from '@faker-js/faker'
import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
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
	// TODO: write better instructions

	// 🐨 render the App instead
	render(<UsernameRoute />)

	await screen.findByRole('heading', { level: 1, name: user.name })
	await screen.findByRole('img', { name: user.name })
	await screen.findByRole('link', { name: `${user.name}'s notes` })
})
