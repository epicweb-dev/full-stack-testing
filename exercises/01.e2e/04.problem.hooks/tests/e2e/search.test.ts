import { expect, test } from '@playwright/test'
import { getPasswordHash } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { createUser } from '../db-utils.ts'

// 🐨 create a Set of strings called `insertedUsers`

// 🐨 add an afterEach hook which uses prisma.user.deleteMany to delete all
// the users in the `insertedUsers` set.
// 🐨 then clear the set.

test('Search from home page', async ({ page }) => {
	const username = `___search_${createUser().username}`.slice(0, 20)
	const newUser = await insertNewUser({ username })
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
	await expect(page.getByAltText(newUser.name)).toBeVisible()

	await page.getByRole('searchbox', { name: /search/i }).fill('__nonexistent__')
	await page.getByRole('button', { name: /search/i }).click()
	await page.waitForURL(`/users?search=__nonexistent__`)

	await expect(userList.getByRole('listitem')).not.toBeVisible()
	await expect(page.getByText(/no users found/i)).toBeVisible()

	// 💣 you can remove this now
	await prisma.user.delete({ where: { id: newUser.id } })
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
	// 🐨 add the user's id to the `insertedUsers` set
	return user as typeof user & { name: string }
}
