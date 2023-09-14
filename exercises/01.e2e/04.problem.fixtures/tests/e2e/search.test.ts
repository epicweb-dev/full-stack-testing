import {
	// 💣 remove expect here (you'll get it from your test variable below)
	expect,
	// 🐨 alias this to "base"
	test,
} from '@playwright/test'
import { prisma } from '#app/utils/db.server.ts'
import { createUser } from '../db-utils.ts'

// 🐨 add a "test" variable here that extends the base test and adds a fixture
// 🐨 create a fixture called insertNewUser. It doesn't require any arguments,
// and it should return the following type:
// Promise<{
//   id: string
//   name: string | null
//   username: string
// }>
// 🐨 The utility should store a `userId` outside of the `use` callback.
// 🐨 Then call `use` with an async callback that creates a new user and stores
// the user's id in the `userId` variable.
// 🐨 Then delete the user using prisma.user.delete({ where: { id: userId } })
// 💯 Handle the case where the user doesn't exist (ie, the test failed before
// creating the user) by using `catch` to swallow the error.
// 🐨 get expect from test.expect here

test('Search from home page', async ({
	page,
	// 🐨 get the insertNewUser fixture here
}) => {
	// 🐨 move this stuff up into the fixture's use callback.
	const userData = createUser()
	const newUser = await prisma.user.create({
		select: { id: true, name: true, username: true },
		data: userData,
	})
	// 🐨 The newUser variable should be assigned to the result of calling insertNewUser

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

	// 💣 you can remove this now
	await prisma.user.delete({ where: { id: newUser.id } })
})
