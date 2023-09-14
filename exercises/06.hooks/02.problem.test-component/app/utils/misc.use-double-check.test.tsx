/**
 * @vitest-environment jsdom
 */
import { act, renderHook } from '@testing-library/react'
import userEventDefault from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { useDoubleCheck } from './misc.tsx'

// 💰 I'm doing this for you because there's a bug in userEvent you shouldn't
// have to worry about...
// https://github.com/testing-library/user-event/issues/1146
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const userEvent = userEventDefault.default ?? userEventDefault

test('hook: prevents default on the first click, and does not on the second', async () => {
	const { result } = await renderHook(() => useDoubleCheck())
	expect(result.current.doubleCheck).toBe(false)
	const myClick = vi.fn()
	const click1 = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
	}) as unknown as React.MouseEvent<HTMLButtonElement>
	await act(() =>
		result.current.getButtonProps({ onClick: myClick }).onClick(click1),
	)
	expect(myClick).toHaveBeenCalledWith(click1)
	expect(myClick).toHaveBeenCalledTimes(1)
	expect(click1.defaultPrevented).toBe(true)
	myClick.mockClear()

	const click2 = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
	}) as unknown as React.MouseEvent<HTMLButtonElement>
	await act(() =>
		result.current.getButtonProps({ onClick: myClick }).onClick(click2),
	)
	expect(myClick).toHaveBeenCalledWith(click2)
	expect(myClick).toHaveBeenCalledTimes(1)
	expect(click2.defaultPrevented).toBe(false)
})

// 🐨 create a test component here. It's up to you how you do it, but it should
// probably render a button that uses the useDoubleCheck hook and renders some
// element that indicates whether the default was prevented or not.

test('TestComponent: prevents default on the first click, and does not on the second', async () => {
	// 🐨 get the user object from userEvent.setup():
	//
	// 🐨 render your test component
	//
	// 🐨 verify the initial state of your elements
	//
	// 🐨 click on the button
	// 🐨 verify the state of your elements after the first click
	//
	// 🐨 click on the button again
	// 🐨 verify the state of your elements after the second click
})
