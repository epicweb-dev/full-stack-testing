/**
 * @vitest-environment jsdom
 */
// 🐨 bring in act and renderHook from @testing-library/react
// 🐨 bring in expect and vi from vitest
import { test } from 'vitest'
// 🐨 import the useDoubleCheck hook from './misc.tsx'

test('hook: prevents default on the first click, and does not on the second', () => {
	// 🐨 call renderHook here and destructure "result"
	//
	// 🐨 assert that the doubleCheck value is false
	//
	// 🐨 create a mock function with vi.fn()
	//
	// 🐨 create a new click event with new MouseEvent
	// 🦺 if you want TypeScript to be happy, follow the example in the instructions
	// for casting the MouseEvent to React.MouseEvent<HTMLButtonElement>
	//
	// 🐨 get the button props from using result.current.getButtonProps and pass
	// your mock function as "onClick"
	// 🐨 call the onClick prop of the buttonProps with your event
	//   💰 this updates state, so you'll want to wrap this in `act`
	//
	// 🐨 assert your mock function was called with the event just once
	// 🐨 assert the event.defaultPrevented is true
	// 🐨 clear the mock function (💰 with mockClear)
	//
	// 🐨 create a second click event with new MouseEvent
	// 🐨 get new button props and call the onClick prop with your second event
	//   💰 remember to wrap it in `act`
	//
	// 🐨 assert your mock function was called with the event just once
	// 🐨 assert the event.defaultPrevented is false
})
