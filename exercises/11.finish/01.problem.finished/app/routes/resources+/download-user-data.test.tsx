/**
 * @vitest-environment node
 */
import { faker } from '@faker-js/faker'
import fs from 'fs'
import { createPassword, createUser } from 'tests/db-utils.ts'
import { BASE_URL, getSessionSetCookieHeader } from 'tests/utils.ts'
import { expect, test } from 'vitest'
import { prisma } from '~/utils/db.server.ts'
import { ROUTE_PATH, loader } from './download-user-data.tsx'

const RESOURCE_URL = `${BASE_URL}${ROUTE_PATH}`

async function setupUser() {
	const userData = createUser()
	const session = await prisma.session.create({
		data: {
			expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
			user: {
				create: {
					...userData,
					password: {
						create: createPassword(userData.username),
					},
					notes: {
						create: {
							title: faker.lorem.sentence(),
							content: faker.lorem.paragraphs(3),
							images: {
								create: {
									contentType: 'image/jpeg',
									blob: await fs.promises.readFile(
										'./tests/fixtures/images/notes/0.png',
									),
								},
							},
						},
					},
					roles: {
						create: {
							name: 'user',
							permissions: {
								create: { action: 'read', entity: 'user', access: 'own' },
							},
						},
					},
					image: {
						create: {
							contentType: 'image/jpeg',
							blob: await fs.promises.readFile(
								'./tests/fixtures/images/user/0.jpg',
							),
						},
					},
				},
			},
		},
		select: {
			id: true,
			user: { select: { id: true, image: { select: { id: true } } } },
		},
	})

	return {
		user: session.user,
		cookie: await getSessionSetCookieHeader(session),
	}
}

test('allows users to download their data', async () => {
	const { cookie } = await setupUser()
	const request = new Request(RESOURCE_URL, {
		method: 'GET',
		headers: { cookie, host: new URL(BASE_URL).host },
	})

	const response = await loader({ request, params: {}, context: {} })
	const json = await response.json()
	expect(json).keys(['user'])
	expect(json.user).keys([
		'createdAt',
		'email',
		'id',
		'image',
		'name',
		'notes',
		'sessions',
		'roles',
		'updatedAt',
		'username',
	])
	expect(json.user.image).keys([
		'contentType',
		'id',
		'url',
		'createdAt',
		'updatedAt',
	])
	expect(json.user.notes).length(1)
	expect(json.user.notes[0]).keys([
		'id',
		'title',
		'images',
		'ownerId',
		'content',
		'createdAt',
		'updatedAt',
	])
	expect(json.user.notes[0].images).length(1)
	expect(json.user.notes[0].images[0]).keys([
		'id',
		'contentType',
		'url',
		'createdAt',
		'updatedAt',
	])
	expect(json.user.sessions).length(1)
	expect(json.user.sessions[0]).keys([
		'id',
		'userId',
		'expirationDate',
		'createdAt',
		'updatedAt',
	])
	expect(json.user.roles).length(1)
	expect(json.user.roles[0]).keys([
		'id',
		'name',
		'description',
		'createdAt',
		'updatedAt',
	])
})

test('requires auth', async () => {
	const request = new Request(RESOURCE_URL, { method: 'POST' })
	const response = await loader({ request, params: {}, context: {} }).catch(
		r => r,
	)
	if (!(response instanceof Response)) {
		throw new Error('Expected response to be a Response')
	}
	expect(response.headers.get('Location')).contains('/login')
})
