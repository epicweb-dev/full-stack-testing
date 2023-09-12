import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'
import fsExtra from 'fs-extra'
import { HttpResponse, http, type HttpHandler } from 'msw'
import { z } from 'zod'

const { json } = HttpResponse

const EmailSchema = z.object({
	to: z.string(),
	from: z.string(),
	subject: z.string(),
	text: z.string(),
	html: z.string().optional(),
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const emailFixturesDirPath = path.join(__dirname, '..', 'fixtures', 'email')
await fsExtra.ensureDir(emailFixturesDirPath)

export const handlers: Array<HttpHandler> = [
	http.post(`https://api.resend.com/emails`, async ({ request }) => {
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
