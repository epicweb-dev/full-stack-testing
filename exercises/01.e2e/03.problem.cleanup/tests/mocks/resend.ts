import { faker } from '@faker-js/faker'
import { HttpResponse, rest, type RestHandler } from 'msw'

const { json } = HttpResponse

export const handlers: Array<RestHandler> = [
	rest.post(`https://api.resend.com/emails`, async ({ request }) => {
		const email = (await request.json()) as Record<string, any>
		console.info('🔶 mocked email contents:', email)

		return json({
			id: faker.string.uuid(),
			from: email.from,
			to: email.to,
			created_at: new Date().toISOString(),
		})
	}),
]
