import 'dotenv/config'
import '#app/utils/env.server.ts'
import { installGlobals } from '@remix-run/node'
import { beforeEach, vi, type SpyInstance } from 'vitest'

installGlobals()

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
