import 'dotenv/config'
import '#app/utils/env.server.ts'
import '@testing-library/jest-dom/vitest'
import { installGlobals } from '@remix-run/node'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi, type SpyInstance } from 'vitest'
import { prisma } from '#app/utils/db.server.ts'
import { insertedUsers } from '#tests/db-utils.ts'
import { server } from '../mocks/index.ts'
import './custom-matchers.ts'

installGlobals()

afterEach(() => server.resetHandlers())
afterEach(() => cleanup())
afterEach(async () => {
	await prisma.user.deleteMany({
		where: { id: { in: [...insertedUsers] } },
	})
	insertedUsers.clear()
})

export let consoleError: SpyInstance<Parameters<typeof console.error>>

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
