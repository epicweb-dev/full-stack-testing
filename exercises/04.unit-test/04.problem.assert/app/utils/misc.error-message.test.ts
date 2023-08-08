import { faker } from '@faker-js/faker'
import { expect, test, vi, beforeEach } from 'vitest'
import { getErrorMessage } from './misc.tsx'

let consoleError: SpyInstance<Parameters<(typeof console)['error']>>

beforeEach(() => {
	consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(() => {})
})

// 🐨 add an afterEach here that ensures console.error was never called

test('Error object returns message', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(new Error(message))).toBe(message)
})

test('String returns itself', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(message)).toBe(message)
})

test('undefined falls back to Unknown', () => {
	expect(getErrorMessage(undefined)).toBe('Unknown Error')
	expect(consoleError).toHaveBeenCalledWith(
		'Unable to get error message for error',
		undefined,
	)
	expect(consoleError).toHaveBeenCalledTimes(1)
	// 🐨 add a consoleError.mockClear() here to clear the mock
	// so the afterEach can verify that it was never unexpectedly called
})
