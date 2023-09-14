import { faker } from '@faker-js/faker'
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

export const handlers: Array<HttpHandler> = [
	http.post(`https://api.resend.com/emails`, async ({ request }) => {
		const email = EmailSchema.parse(await request.json())
		console.info('🔶 mocked email contents:', email)

		return json({
			id: faker.string.uuid(),
			from: email.from,
			to: email.to,
			created_at: new Date().toISOString(),
		})
	}),
]
