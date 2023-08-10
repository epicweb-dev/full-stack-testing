/**
 * @vitest-environment jsdom
 */
import { faker } from '@faker-js/faker'
// 🐨 get cleanup from here:
import { render, screen } from '@testing-library/react'
// 🐨 get afterEach from here:
import { expect, test } from 'vitest'
import { ErrorList } from './forms.tsx'

// 🐨 add an afterEach here that calls cleanup

// 🦉 that's it... The tests should pass now.

test('shows nothing when given an empty list', () => {
	render(<ErrorList />)
	expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})

test('shows a single error', () => {
	const errors = [faker.lorem.words(3)]
	render(<ErrorList errors={errors} />)
	const errorEls = screen.getAllByRole('listitem')
	expect(errorEls.map(e => e.textContent)).toEqual(errors)
})

test('shows multiple errors', () => {
	// 🐨 add a screen.debug() here to test what things look like before/after
	// you add the cleanup call
	const errors = [faker.lorem.words(3), faker.lorem.words(3)]
	render(<ErrorList errors={errors} />)
	const errorEls = screen.getAllByRole('listitem')
	expect(errorEls.map(e => e.textContent)).toEqual(errors)
})

test('can cope with falsy values', () => {
	const errors = [
		faker.lorem.words(3),
		null,
		faker.lorem.words(3),
		undefined,
		'',
	]
	render(<ErrorList errors={errors} />)
	const errorEls = screen.getAllByRole('listitem')
	const actualErrors = errors.filter(Boolean)
	expect(errorEls).toHaveLength(actualErrors.length)
	expect(errorEls.map(e => e.textContent)).toEqual(actualErrors)
})

test('adds id to the ul', () => {
	const id = faker.lorem.word()
	render(<ErrorList id={id} errors={[faker.lorem.words(3)]} />)
	const ul = screen.getByRole('list')
	expect(ul.getAttribute('id')).toBe(id)
})
