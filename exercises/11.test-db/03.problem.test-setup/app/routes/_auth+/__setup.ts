import path from 'node:path'
import { execaCommand } from 'execa'
import fsExtra from 'fs-extra'
import { afterAll, afterEach, beforeAll } from 'vitest'

// 🐨 update this file path to include the process.env.VITEST_POOL_ID variable
// to keep it unique and then move this file to tests/setup/db-setup.ts.
const databaseFile = `./tests/prisma/data.db`
const databasePath = path.join(process.cwd(), databaseFile)
process.env.DATABASE_URL = `file:${databasePath}`

beforeAll(async () => {
	await execaCommand('prisma migrate reset --force --skip-generate', {
		stdio: 'inherit',
		env: { MINIMAL_SEED: 'true', ...process.env },
	})
})

afterEach(async () => {
	const { prisma } = await import('#app/utils/db.server.ts')
	await prisma.user.deleteMany()
	await prisma.verification.deleteMany()
	await prisma.role.deleteMany()
	await prisma.permission.deleteMany()
})

afterAll(async () => {
	const { prisma } = await import('#app/utils/db.server.ts')
	prisma.$disconnect()
	await fsExtra.remove(databasePath)
})
