import { test } from '@playwright/test'
import { getPasswordHash } from '~/utils/auth.server.ts'
import { prisma } from '~/utils/db.server.ts'
import { createUser } from '../tests/db-utils.ts'

const userIdsToDelete = new Set<string>()

export async function insertNewUser({
	username,
	password,
}: { username?: string; password?: string } = {}) {
	const userData = createUser()
	username ??= userData.username
	password ??= userData.username
	const user = await prisma.user.create({
		select: { id: true, name: true, username: true, email: true },
		data: {
			...userData,
			username,
			roles: { connect: { name: 'user' } },
			password: { create: { hash: await getPasswordHash(password) } },
		},
	})
	userIdsToDelete.add(user.id)
	return user as typeof user & { name: string }
}

/**
 * This allows you to wait for something (like an email to be available).
 *
 * It calls the callback every 50ms until it returns a value (and does not throw
 * an error). After the timeout, it will throw the last error that was thrown or
 * throw the error message provided as a fallback
 */
export async function waitFor<ReturnValue>(
	cb: () => ReturnValue | Promise<ReturnValue>,
	{
		errorMessage,
		timeout = 5000,
	}: { errorMessage?: string; timeout?: number } = {},
) {
	const endTime = Date.now() + timeout
	let lastError: unknown = new Error(errorMessage)
	while (Date.now() < endTime) {
		try {
			const response = await cb()
			if (response) return response
		} catch (e: unknown) {
			lastError = e
		}
		await new Promise(r => setTimeout(r, 100))
	}
	throw lastError
}

test.afterEach(async () => {
	await prisma.user.deleteMany({
		where: { id: { in: Array.from(userIdsToDelete) } },
	})
	userIdsToDelete.clear()
})
