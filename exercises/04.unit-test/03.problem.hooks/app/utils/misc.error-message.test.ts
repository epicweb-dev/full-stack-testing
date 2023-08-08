import { faker } from '@faker-js/faker'
// 🐨 bring in beforeEach and SpyInstance from vitest
import { expect, test, vi } from 'vitest'
import { getErrorMessage } from './misc.tsx'

// 🐨 declare a consoleError variable here (using let)
// 🦺 if you want to make TypeScript happy about this variable, here's the
// typing for that: SpyInstance<Parameters<(typeof console)['error']>>

// 🐨 move the code you had in the last test into a beforeEach here
// and assign the consoleError variable to the result of that.

test('Error object returns message', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(new Error(message))).toBe(message)
})

test('String returns itself', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(message)).toBe(message)
})

test('undefined falls back to Unknown', () => {
	// 🐨 move this stuff up to the beforeEach
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
