import { faker } from '@faker-js/faker'
// 🐨 you'll get vi from here
import { expect, test } from 'vitest'
import { getErrorMessage } from './misc.tsx'

test('Error object returns message', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(new Error(message))).toBe(message)
})

test('String returns itself', () => {
	const message = faker.lorem.words(2)
	expect(getErrorMessage(message)).toBe(message)
})

test('undefined falls back to Unknown', () => {
	// 🐨 use spyOn on the console's error property
	// 🐨 mock the implementation with a function that does nothing (💰 () => {})
	expect(getErrorMessage(undefined)).toBe('Unknown Error')
	// 🐨 make sure console.error was once
	// 🐨 assert that it was called with the right arguments
	// 🐨 restore the mock so we don't swallow errors for other tests.
})
