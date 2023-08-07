import { expect, test } from '@playwright/test'
// 🐨 you'll get the getPasswordHash from ~/utils/auth.server.ts
// 🐨 get a prisma client from ~/utils/db.server.ts
// 🐨 get the createUser util from ../db-utils.ts

test('Search from home page', async ({ page }) => {
	// 🐨 create a new user in the database. Make sure to set their
	// roles, and password (💰 check the seed.ts script or the
	// signup util in auth.server.ts for reference)
	await page.goto('/')

	// 🐨 fill in the new user's username
	await page.getByRole('searchbox', { name: /search/i }).fill('kody')
	await page.getByRole('button', { name: /search/i }).click()

	// 🐨 swap out "kody" for the user's username
	// 💯 handle encoding this properly using URLSearchParams
	await page.waitForURL(`/users?search=kody`)
	await expect(page.getByText('Epic Notes Users')).toBeVisible()
	const userList = page.getByRole('main').getByRole('list')
	await expect(userList.getByRole('listitem')).toHaveCount(1)
	// 🐨 update this to be user's name (with a fallback to their username)
	await expect(page.getByAltText('kody')).toBeVisible()

	await page.getByRole('searchbox', { name: /search/i }).fill('__nonexistent__')
	await page.getByRole('button', { name: /search/i }).click()
	await page.waitForURL(`/users?search=__nonexistent__`)

	await expect(userList.getByRole('listitem')).not.toBeVisible()
	await expect(page.getByText(/no users found/i)).toBeVisible()
})
