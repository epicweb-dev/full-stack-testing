import path from 'node:path'
import { execaCommand } from 'execa'
import fsExtra from 'fs-extra'
import { afterAll, afterEach, beforeAll } from 'vitest'
// 🐨 import the BASE_DATABASE_PATH from './global-setup.ts'

const databaseFile = `./tests/prisma/data.${process.env.VITEST_POOL_ID || 0}.db`
const databasePath = path.join(process.cwd(), databaseFile)
process.env.DATABASE_URL = `file:${databasePath}`

beforeAll(async () => {
	// 🐨 move this command to ./global-setup.ts
	await execaCommand(
		'prisma migrate reset --force --skip-seed --skip-generate',
		{ stdio: 'inherit' },
	)
	// 🐨 use fsExtra.copyFile to copy the BASE_DATABASE_PATH to the databasePath
})

afterEach(async () => {
	const { prisma } = await import('#app/utils/db.server.ts')
	await prisma.user.deleteMany()
})

afterAll(async () => {
	const { prisma } = await import('#app/utils/db.server.ts')
	await prisma.$disconnect()
	await fsExtra.remove(databasePath)
})
