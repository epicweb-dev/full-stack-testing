import { expect, test } from '@playwright/test'
import { createUser } from '../db-utils.ts'
import { prisma } from '~/utils/db.server.ts'
import { getPasswordHash } from '~/utils/auth.server.ts'

const userIdsToDelete = new Set<string>()

test.afterEach(async () => {
	await prisma.user.deleteMany({
		where: { id: { in: Array.from(userIdsToDelete) } },
	})
	userIdsToDelete.clear()
})

test('Search from home page', async ({ page }) => {
	const newUser = await insertNewUser({
		username: '___very_unique_username___',
	})
	await page.goto('/')

	await page.getByRole('searchbox', { name: /search/i }).fill(newUser.username)
	await page.getByRole('button', { name: /search/i }).click()

	await page.waitForURL(
		`/users?${new URLSearchParams({ search: newUser.username })}`,
	)
	await expect(page.getByText('Epic Notes Users')).toBeVisible()
	const userList = page.getByRole('main').getByRole('list')
	await expect(userList.getByRole('listitem')).toHaveCount(1)
	await expect(
		page.getByAltText(newUser.name ?? newUser.username),
	).toBeVisible()

	await page.getByRole('searchbox', { name: /search/i }).fill('__nonexistent__')
	await page.getByRole('button', { name: /search/i }).click()
	await page.waitForURL(`/users?search=__nonexistent__`)

	await expect(userList.getByRole('listitem')).not.toBeVisible()
	await expect(page.getByText(/no users found/i)).toBeVisible()
})

export async function insertNewUser({ username }: { username: string }) {
	const userData = createUser()
	const user = await prisma.user.create({
		select: { id: true, name: true, username: true, email: true },
		data: {
			...userData,
			username,
			roles: { connect: { name: 'user' } },
			password: { create: { hash: await getPasswordHash(username) } },
		},
	})
	return user as typeof user & { name: string }
}
