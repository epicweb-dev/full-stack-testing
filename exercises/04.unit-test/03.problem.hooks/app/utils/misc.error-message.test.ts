import { faker } from '@faker-js/faker'
// 🐨 bring in beforeEach and SpyInstance from vitest
import { expect, test, vi } from 'vitest'
import { getErrorMessage } from './misc.tsx'

// 🐨 declare a consoleError variable here (using let)
// 🦺 if you want to make TypeScript happy about this variable, here's the
// typing for that: SpyInstance<Parameters<typeof console.error>>

// 🐨 create a beforeEach. It should get the originalConsoleError, then assign
// the consoleError to vi.spyOn...
// 🐨 Then mock the implementation of consoleError to call the originalConsoleError
// 🐨 Then throw a new error with a message explaining that console.error was called
// and that you should call consoleError.mockImplementation(() => {}) if you expect
// that to happen.

test('Error object returns message', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(new Error(message))).toBe(message)
})

test('String returns itself', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(message)).toBe(message)
})

test('undefined falls back to Unknown', () => {
	// 🐨 remove this assignment and use the consoleError from above
	const consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(() => {})

	expect(getErrorMessage(undefined)).toBe('Unknown Error')
	expect(consoleError).toHaveBeenCalledWith(
		'Unable to get error message for error',
		undefined,
	)
	expect(consoleError).toHaveBeenCalledTimes(1)
	// 💣 remove this in favor of the global config you'll make in the vitest.config.ts
	consoleError.mockRestore()
})
