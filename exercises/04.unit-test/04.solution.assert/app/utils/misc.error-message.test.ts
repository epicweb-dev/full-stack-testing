import { faker } from '@faker-js/faker'
import {
	afterEach,
	beforeEach,
	expect,
	test,
	vi,
	type SpyInstance,
} from 'vitest'
import { getErrorMessage } from './misc.tsx'

let consoleError: SpyInstance<Parameters<(typeof console)['error']>>

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

afterEach(() => {
	expect(
		consoleError,
		'make sure to call mockClear in any test you expect console.error to be called',
	).not.toHaveBeenCalled()
})

test('Error object returns message', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(new Error(message))).toBe(message)
})

test('String returns itself', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(message)).toBe(message)
})

test('undefined falls back to Unknown', () => {
	consoleError.mockImplementation(() => {})
	expect(getErrorMessage(undefined)).toBe('Unknown Error')
	expect(consoleError).toHaveBeenCalledWith(
		'Unable to get error message for error',
		undefined,
	)
	expect(consoleError).toHaveBeenCalledTimes(1)
})
