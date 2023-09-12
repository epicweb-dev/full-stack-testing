import 'dotenv/config'
import 'source-map-support/register.js'
import '#app/utils/env.server.ts'
// we need these to be imported first 👆

import { installGlobals } from '@remix-run/node'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, expect, vi, type SpyInstance } from 'vitest'
import { prisma } from '#app/utils/db.server.ts'
import { insertedUsers } from '#tests/db-utils.ts'
import { server } from '../mocks/index.ts'

installGlobals()

afterEach(() => server.resetHandlers())
afterEach(() => cleanup())
afterEach(async () => {
	await prisma.user.deleteMany({
		where: { id: { in: [...insertedUsers] } },
	})
	insertedUsers.clear()
})

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
