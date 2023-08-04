import 'source-map-support/register'
import './setup-env-vars.ts'
import { installGlobals } from '@remix-run/node'
import 'dotenv/config'
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
import { cleanup } from '@testing-library/react'
import '~/utils/env.server.ts'
import { server } from '../mocks/index.ts'
import { BASE_DATABASE_PATH, DATABASE_PATH } from './paths.ts'
import './custom-matchers.ts'

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

export let consoleError:
	| SpyInstance<Parameters<(typeof console)['error']>>
	| undefined

beforeEach(() => {
	consoleError = vi.spyOn(console, 'error')
	consoleError.mockImplementation(() => {})
})

afterEach(() => {
	// make sure to call mockClear in any test you expect console.error to be called
	expect(
		consoleError,
		'make sure to call mockClear in any test you expect console.error to be called',
	).not.toHaveBeenCalled()
	consoleError?.mockRestore()
})
