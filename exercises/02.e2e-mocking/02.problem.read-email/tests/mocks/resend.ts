import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'
import fsExtra from 'fs-extra'
import { HttpResponse, rest, type RestHandler } from 'msw'

const { json } = HttpResponse

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const emailFixturesDirPath = path.join(__dirname, '..', 'fixtures', 'email')
await fsExtra.ensureDir(emailFixturesDirPath)

// 🐨 export an async function called requireEmail that takes an email address
// and returns the email that was sent to that address.
// 💰 await fsExtra.readJSON(path.join(emailFixturesDirPath, `${recipient}.json`))

export const handlers: Array<RestHandler> = [
	rest.post(`https://api.resend.com/emails`, async ({ request }) => {
		const email = (await request.json()) as Record<string, any>
		console.info('🔶 mocked email contents:', email)

		await fsExtra.writeJSON(
			path.join(emailFixturesDirPath, `./${email.to}.json`),
			email,
		)

		return json({
			id: faker.string.uuid(),
			from: email.from,
			to: email.to,
			created_at: new Date().toISOString(),
		})
	}),
]
