import { faker } from '@faker-js/faker'
import { expect, test } from 'vitest'
import { getErrorMessage } from './misc.tsx'
import { consoleError } from 'tests/setup/setup-test-env.ts'

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
	expect(consoleError).toHaveBeenCalledTimes(1)
	consoleError.mockClear()
})
