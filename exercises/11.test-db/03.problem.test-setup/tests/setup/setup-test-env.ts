import 'dotenv/config'
import 'source-map-support/register.js'
// 🐨 import the ./db-setup.ts file here
import '~/utils/env.server.ts'
// we need these to be imported first 👆

import { installGlobals } from '@remix-run/node'
import { cleanup } from '@testing-library/react'
import { insertedUsers } from 'tests/db-utils.ts'
import { afterEach, beforeEach, expect, vi, type SpyInstance } from 'vitest'
import { prisma } from '~/utils/db.server.ts'
import { server } from '../mocks/index.ts'
import './custom-matchers.ts'

installGlobals()

afterEach(() => server.resetHandlers())
afterEach(() => cleanup())
// 💣 now that we're isolated, we no longer need to worry about keeping track
// of inserted users and deleting them here, We're handling that generally in
// the db-setup.ts file, so you can delete this afterEach.
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
