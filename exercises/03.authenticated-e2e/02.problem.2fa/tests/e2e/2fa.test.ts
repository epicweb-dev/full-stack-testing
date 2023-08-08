// 🐨 you'll want to import generateTOTP from @epic-web/totp
import { faker } from '@faker-js/faker'
import { expect, test } from '@playwright/test'
import * as setCookieParser from 'set-cookie-parser'
import { sessionKey } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { sessionStorage } from '~/utils/session.server.ts'
import { insertNewUser } from '../db-utils.ts'

test('Users can add 2FA to their account and use it when logging in', async ({
	page,
}) => {
	const password = faker.internet.password()
	const user = await insertNewUser({ password })
	const session = await prisma.session.create({
		data: {
			expirationDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
			userId: user.id,
		},
		select: { id: true },
	})

	const cookieSession = await sessionStorage.getSession()
	cookieSession.set(sessionKey, session.id)
	const cookieConfig = setCookieParser.parseString(
		await sessionStorage.commitSession(cookieSession),
	) as any
	await page.context().addCookies([{ ...cookieConfig, domain: 'localhost' }])
	await page.goto('/settings/profile')

	await page.getByRole('link', { name: /enable 2fa/i }).click()

	await expect(page).toHaveURL(`/settings/profile/two-factor`)
	const main = page.getByRole('main')
	await main.getByRole('button', { name: /enable 2fa/i }).click()

	// 🐨 get th otpUriString by finding something in the `main` element with the
	// label "One-Time Password URI" (getByLabel). Then use innerText() to get the
	// URI string.
	// 📜 https://playwright.dev/docs/api/class-page#page-get-by-label
	// 📜 https://playwright.dev/docs/api/class-elementhandle#element-handle-inner-text

	// 🐨 Get the options from the otpUriString
	// 💰 you can use Object.fromEntries(new URL(otpUri).searchParams)

	// 🐨 get an otp by calling generateTOTP with the options you got from the URI
	// 💰 it'll give you back an object with an "otp" property.

	// 🐨 fill in the textbox with the name "Code" and click the submit button
	// 🐨 verify 2fa is enabled (💰 check for the text "You have enabled two-factor authentication" and/or the link "Disable 2FA").

	// 🐨 logout and go through the login process again
	// 💰 here's how you do that:
	// await page.goto('/login')
	// await expect(page).toHaveURL(`/login`)
	// await page.getByRole('textbox', { name: /username/i }).fill(user.username)
	// await page.getByLabel(/^password$/i).fill(password)
	// await page.getByRole('button', { name: /log in/i }).click()

	// 🐨 when you're presented with the 2fa screen, call generateTOTP again with
	// the same options as before.
	// 🐨 fill in the textbox with the name "Code" and click the submit button
	// verify you're logged in by checking a link with your user.name is visible
})
