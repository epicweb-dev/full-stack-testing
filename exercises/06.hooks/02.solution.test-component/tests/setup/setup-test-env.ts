import 'dotenv/config'
import '~/utils/env.server.ts'
import 'source-map-support/register.js'
// we need these to be imported first 👆

import { installGlobals } from '@remix-run/node'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, expect, vi, type SpyInstance } from 'vitest'

installGlobals()

afterEach(() => cleanup())

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
})
