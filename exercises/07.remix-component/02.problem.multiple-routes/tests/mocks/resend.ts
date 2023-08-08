import { faker } from '@faker-js/faker'
import { HttpResponse, rest, type RestHandler } from 'msw'
import { requireHeader, writeEmail } from './utils.ts'

const { json } = HttpResponse

export const handlers: Array<RestHandler> = [
	rest.post(`https://api.resend.com/emails`, async ({ request }) => {
		requireHeader(request.headers, 'Authorization')
		const body = await request.json()
		console.info('🔶 mocked email contents:', body)

		const email = await writeEmail(body)

		return json({
			id: faker.string.uuid(),
			from: email.from,
			to: email.to,
			created_at: new Date().toISOString(),
		})
	}),
]
