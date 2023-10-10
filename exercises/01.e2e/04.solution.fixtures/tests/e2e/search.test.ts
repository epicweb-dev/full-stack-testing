import { test as base } from '@playwright/test'
import { prisma } from '#app/utils/db.server.ts'
import { createUser } from '../db-utils.ts'

const test = base.extend<{
	insertNewUser(): Promise<{
		id: string
		name: string | null
		username: string
	}>
}>({
	insertNewUser: async ({}, use) => {
		let userId: string | undefined = undefined
		await use(async () => {
			const userData = createUser()
			const newUser = await prisma.user.create({
				select: { id: true, name: true, username: true },
				data: userData,
			})
			userId = newUser.id
			return newUser
		})
		await prisma.user.deleteMany({ where: { id: userId } })
	},
})
const { expect } = test

test('Search from home page', async ({ page, insertNewUser }) => {
	const newUser = await insertNewUser()
	// throw new Error('🧝‍♂️ Oh no, I broke it')
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
