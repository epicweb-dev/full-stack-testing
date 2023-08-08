/**
 * @vitest-environment jsdom
 */
// 🐨 bring in act and renderHook from @testing-library/react
// 🐨 bring in expect, test, and vi from vitest
import { expect, test, vi } from 'vitest'
import { useDoubleCheck } from './misc.tsx'

test('hook: prevents default on the first click, and does not on the second', () => {
	const { result } = renderHook(() => useDoubleCheck())
	expect(result.current.doubleCheck).toBe(false)
	const myClick = vi.fn()
	const click1 = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
	})
	// @ts-expect-error the types here are different :(
	act(() => result.current.getButtonProps({ onClick: myClick }).onClick(click1))
	expect(myClick).toHaveBeenCalledWith(click1)
	expect(myClick).toHaveBeenCalledTimes(1)
	expect(click1.defaultPrevented).toBe(true)
	myClick.mockClear()

	const click2 = new MouseEvent('click', {
		bubbles: true,
		cancelable: true,
	})
	// @ts-expect-error the types here are different :(
	act(() => result.current.getButtonProps({ onClick: myClick }).onClick(click2))
	expect(myClick).toHaveBeenCalledWith(click2)
	expect(myClick).toHaveBeenCalledTimes(1)
	expect(click2.defaultPrevented).toBe(false)
})
