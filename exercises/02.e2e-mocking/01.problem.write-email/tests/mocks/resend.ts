import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'
import fsExtra from 'fs-extra'
import { HttpResponse, rest, type RestHandler } from 'msw'

const { json } = HttpResponse

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const emailFixturesDirPath = path.join(__dirname, '..', 'fixtures', 'email')
await fsExtra.ensureDir(emailFixturesDirPath)

export const handlers: Array<RestHandler> = [
	rest.post(`https://api.resend.com/emails`, async ({ request }) => {
		const email = (await request.json()) as Record<string, any>
		console.info('🔶 mocked email contents:', email)

		// 🐨 write the email as json to a json file in the email directory with the
		// filename set to the "to" email address.
		// 💰 await fsExtra.writeJSON(path.join(emailFixturesDirPath, `./${email.to}.json`), email)

		return json({
			id: faker.string.uuid(),
			from: email.from,
			to: email.to,
			created_at: new Date().toISOString(),
		})
	}),
]
