import 'dotenv/config'
// 🐨 import ./db-setup.ts here
import '#app/utils/env.server.ts'
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi, type MockInstance } from 'vitest'
import { prisma } from '#app/utils/db.server.ts'
import { insertedUsers } from '#tests/db-utils.ts'
import { server } from '../mocks/index.ts'
import './custom-matchers.ts'

afterEach(() => server.resetHandlers())
afterEach(() => cleanup())
// 💣 now that we're isolated, we no longer need to worry about keeping track
// of the users and we're wiping the whole database anyway, so you can remove this:
afterEach(async () => {
	await prisma.user.deleteMany({
		where: { id: { in: [...insertedUsers] } },
	})
	insertedUsers.clear()
})

export let consoleError: MockInstance<typeof console.error>

beforeEach(() => {
	const originalConsoleError = console.error
	consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(
		(...args: Parameters<typeof console.error>) => {
			originalConsoleError(...args)
			throw new Error(
				'Console error was called. Call consoleError.mockImplementation(() => {}) if this is expected.',
			)
		},
	)
})
