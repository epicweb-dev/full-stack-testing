import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'
import fsExtra from 'fs-extra'
import { HttpResponse, rest, type RestHandler } from 'msw'
// 🐨 you'll need zod for the EmailSchema

const { json } = HttpResponse

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const emailFixturesDirPath = path.join(__dirname, '..', 'fixtures', 'email')
await fsExtra.ensureDir(emailFixturesDirPath)

// 🐨 create an EmailSchema here using zod. It should be an object with the
// following string properties: to, from, subject, text, html

export const handlers: Array<RestHandler> = [
	rest.post(`https://api.resend.com/emails`, async ({ request }) => {
		// 🐨 check for the required Authorization header here and throw an error
		// if it's not there.
		// 🦉 you could also return a 401 response. I ran into two issues with that:
		// 1. https://github.com/mswjs/msw/issues/1690
		// 2. https://github.com/mswjs/msw/issues/1691
		// hopefully these will be improved later...
		// but you do typically want to make your mocks resemble the real API as
		// closely as possible, so returning a 401 response following the resend
		// API's spec would be good: https://resend.com/docs/api-reference/errors
		// 🐨 But for now, throwing an error is sufficient for what we're doing.

		// 🐨 parse the request.json using the EmailSchema you created above
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
