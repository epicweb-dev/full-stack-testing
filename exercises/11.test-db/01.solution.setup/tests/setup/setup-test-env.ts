import 'dotenv/config'
import './db-setup.ts'
import '#app/utils/env.server.ts'
import '@testing-library/jest-dom/vitest'
import { installGlobals } from '@remix-run/node'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi, type MockInstance } from 'vitest'
import { server } from '../mocks/index.ts'
import './custom-matchers.ts'

installGlobals()

afterEach(() => server.resetHandlers())
afterEach(() => cleanup())

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
