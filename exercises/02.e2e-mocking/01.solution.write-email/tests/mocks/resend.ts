import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'
import fsExtra from 'fs-extra'
import { HttpResponse, rest, type RestHandler } from 'msw'
import { z } from 'zod'

const { json } = HttpResponse

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const emailFixturesDirPath = path.join(__dirname, '..', 'fixtures', 'email')
await fsExtra.ensureDir(emailFixturesDirPath)

const EmailSchema = z.object({
	to: z.string(),
	from: z.string(),
	subject: z.string(),
	text: z.string(),
	html: z.string(),
})

export const handlers: Array<RestHandler> = [
	rest.post(`https://api.resend.com/emails`, async ({ request }) => {
		if (!request.headers.get('Authorization')) {
			throw new Error('Authorization header is required')
		}
		const email = EmailSchema.parse(await request.json())
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
