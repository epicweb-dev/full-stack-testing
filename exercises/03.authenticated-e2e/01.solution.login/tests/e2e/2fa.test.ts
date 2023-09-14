import { faker } from '@faker-js/faker'
import * as setCookieParser from 'set-cookie-parser'
import { getSessionExpirationDate, sessionKey } from '#app/utils/auth.server.ts'
import { prisma } from '#app/utils/db.server.ts'
import { invariant } from '#app/utils/misc.tsx'
import { sessionStorage } from '#app/utils/session.server.ts'
import { expect, test } from '#tests/playwright-utils.ts'

test('Users can add 2FA to their account and use it when logging in', async ({
	page,
	insertNewUser,
}) => {
	const password = faker.internet.password()
	const user = await insertNewUser({ password })
	invariant(user.name, 'User name is not defined')
	const session = await prisma.session.create({
		data: {
			expirationDate: getSessionExpirationDate(),
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
})
