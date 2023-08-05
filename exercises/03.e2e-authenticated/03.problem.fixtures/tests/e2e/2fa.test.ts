import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import { insertNewUser, loginPage } from '../playwright-utils.ts'

test('Users can add 2FA to their account and use it when logging in', async ({
	page,
	baseURL,
}) => {
	const password = faker.internet.password()
	const user = await insertNewUser({ password })
	await loginPage({ page, baseURL, user })
	await page.goto('/settings/profile')

	await page.getByRole('link', { name: /enable 2fa/i }).click()

	await expect(page).toHaveURL(`/settings/profile/two-factor`)
	const main = page.getByRole('main')
	await main.getByRole('button', { name: /enable 2fa/i }).click()
})
