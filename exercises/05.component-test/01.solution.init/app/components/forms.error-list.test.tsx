/**
 * @vitest-environment jsdom
 */
import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { ErrorList } from './forms.tsx'

test('shows nothing when given an empty list', async () => {
	await render(<ErrorList />)
	expect(screen.queryAllByRole('listitem')).toHaveLength(0)
})
