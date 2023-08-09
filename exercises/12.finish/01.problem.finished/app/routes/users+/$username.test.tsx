/**
 * @vitest-environment jsdom
 */
import { faker } from '@faker-js/faker'
import { unstable_createRemixStub as createRemixStub } from '@remix-run/testing'
import { render, screen } from '@testing-library/react'
import { test } from 'vitest'
import { getUserImages, insertNewUser } from 'tests/db-utils.ts'
import { getSessionCookieHeader } from 'tests/utils.ts'
import { loader as rootLoader } from '~/root.tsx'
import { prisma } from '~/utils/db.server.ts'
import { default as UsernameRoute, loader } from './$username.tsx'

test('The user profile when not logged in as self', async () => {
	const user = await insertNewUser()
	const userImages = await getUserImages()
	const userImage =
		userImages[faker.number.int({ min: 0, max: userImages.length - 1 })]
	await prisma.user.update({
		where: { id: user.id },
		data: { image: { create: userImage } },
	})
	const App = createRemixStub([
		{
			path: '/users/:username',
			element: <UsernameRoute />,
			loader,
		},
	])

	const routeUrl = `/users/${user.username}`
	render(<App initialEntries={[routeUrl]} />)

	await screen.findByRole('heading', { level: 1, name: user.name })
	await screen.findByRole('img', { name: user.name })
	await screen.findByRole('link', { name: `${user.name}'s notes` })
})

test('The user profile when logged in as self', async () => {
	const user = await insertNewUser()
	const userImages = await getUserImages()
	const userImage =
		userImages[faker.number.int({ min: 0, max: userImages.length - 1 })]
	await prisma.user.update({
		where: { id: user.id },
		data: {
			image: { create: userImage },
			sessions: {
				create: {
					expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
				},
			},
		},
	})
	const session = await prisma.session.create({
		select: { id: true },
		data: {
			expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
			userId: user.id,
		},
	})

	const cookieHeader = await getSessionCookieHeader(session)

	const App = createRemixStub([
		{
			id: 'root',
			path: '/',
			loader: async args => {
				// add the cookie header to the request
				args.request.headers.set('cookie', cookieHeader)
				return rootLoader(args)
			},
			children: [
				{
					path: 'users/:username',
					element: <UsernameRoute />,
					loader: async args => {
						// add the cookie header to the request
						args.request.headers.set('cookie', cookieHeader)
						// @ts-expect-error https://github.com/remix-run/remix/issues/7082
						return loader(args)
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
