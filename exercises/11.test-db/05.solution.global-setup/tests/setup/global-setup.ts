import path from 'node:path'
import { execaCommand } from 'execa'
import fsExtra from 'fs-extra'

const baseDatabaseFile = `./tests/prisma/base.db`
export const BASE_DATABASE_PATH = path.join(process.cwd(), baseDatabaseFile)
export const BASE_DATABASE_URL = `file:${BASE_DATABASE_PATH}`

export async function setup() {
	await fsExtra.ensureDir(path.dirname(BASE_DATABASE_PATH))
	await ensureDbReady()
	return async function teardown() {}
}

async function ensureDbReady() {
	if (!(await fsExtra.pathExists(BASE_DATABASE_PATH))) {
		await execaCommand('prisma migrate reset --force --skip-generate', {
			stdio: 'inherit',
			env: {
				...process.env,
				MINIMAL_SEED: 'true',
				DATABASE_URL: BASE_DATABASE_URL,
			},
		})
	}
}
