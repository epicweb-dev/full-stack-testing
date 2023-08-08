import { expect, test } from '@playwright/test'
import { getPasswordHash } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { createUser } from '../db-utils.ts'

test('Search from home page', async ({ page }) => {
	const userData = createUser()
	const newUser = await prisma.user.create({
		select: { id: true, name: true, username: true, email: true },
		data: {
			...userData,
			roles: { connect: { name: 'user' } },
			password: { create: { hash: await getPasswordHash(userData.username) } },
		},
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

	// 🐨 delete the user you created here
})
