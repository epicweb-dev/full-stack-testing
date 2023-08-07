import { expect, test } from '@playwright/test'
import { getPasswordHash } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { createUser } from '../db-utils.ts'

test('Search from home page', async ({ page }) => {
	// 🐨 go down to the insertNewUser util to make a couple updates first.
	// 🐨 once you've done that update, create a username here that starts with
	// `___search_` and then append the username from the createUser util.
	// And make sure it's no longer than 20 characters (💰 .slice(0, 20)) to match
	// our validation requirements.
	// 🐨 pass that username to insertNewUser
	const newUser = await insertNewUser()
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

	// 🐨 delete the user you created here
})

// 🐨 accept an optional username here
export async function insertNewUser() {
	const userData = createUser()
	const user = await prisma.user.create({
		select: { id: true, name: true, username: true, email: true },
		data: {
			...userData,
			// 🐨 override the username property here
			roles: { connect: { name: 'user' } },
			// 🐨 use the username provided instead of userData.username
			// 🦉 this doesn't really matter much in our case, but it's just nice to be
			// consistent with what our seed script does. "Principle of least surprise" etc.
			password: { create: { hash: await getPasswordHash(userData.username) } },
		},
	})
	return user as typeof user & { name: string }
}
