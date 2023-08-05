import './setup-env-vars.ts'
import 'dotenv/config'
import 'source-map-support/register'
// we need these to be imported first 👆

import { installGlobals } from '@remix-run/node'
import { cleanup } from '@testing-library/react'
import fs from 'fs'
import {
	afterAll,
	afterEach,
	beforeEach,
	expect,
	vi,
	type SpyInstance,
} from 'vitest'
import { prisma } from '~/utils/db.server.ts'
import '~/utils/env.server.ts'
import { server } from '../mocks/index.ts'
import './custom-matchers.ts'
import { BASE_DATABASE_PATH, DATABASE_PATH } from './paths.ts'

installGlobals()
fs.copyFileSync(BASE_DATABASE_PATH, DATABASE_PATH)

beforeEach(() => {
	server.resetHandlers()
})

afterEach(async () => {
	await prisma.user.deleteMany()
	await prisma.permission.deleteMany()
	await prisma.role.deleteMany()
	cleanup()
})

afterAll(async () => {
	await prisma.$disconnect()
	await fs.promises.rm(DATABASE_PATH)
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
	consoleError.mockRestore()
})
