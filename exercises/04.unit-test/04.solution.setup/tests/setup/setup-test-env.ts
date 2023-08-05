import { installGlobals } from '@remix-run/node'
import 'dotenv/config'
import 'source-map-support/register'
import { afterEach, beforeEach, expect, vi, type SpyInstance } from 'vitest'
import '~/utils/env.server.ts'

installGlobals()

export let consoleError: SpyInstance<Parameters<(typeof console)['error']>>

beforeEach(() => {
	consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(() => {})
})

afterEach(() => {
	expect(
		consoleError,
		'make sure to call mockClear in any test you expect console.error to be called',
	).not.toHaveBeenCalled()
	consoleError.mockRestore()
})
