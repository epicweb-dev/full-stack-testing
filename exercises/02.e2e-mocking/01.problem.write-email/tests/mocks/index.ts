import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { faker } from '@faker-js/faker'
import closeWithGrace from 'close-with-grace'
// 🐨 you can get fsExtra from 'fs-extra'
import { HttpResponse, passthrough, rest } from 'msw'
import { setupServer } from 'msw/node'
// 🐨 you'll need zod for the EmailSchema

const { json } = HttpResponse

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// 💣 you can remove this comment once you're using this variable below
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fixturesDirPath = path.join(__dirname, '..', 'fixtures')

export const MOCK_ACCESS_TOKEN = '__MOCK_ACCESS_TOKEN__'
export const primaryGitHubEmail = {
	email: faker.internet.email(),
	verified: true,
	primary: true,
	visibility: 'public',
}
const githubEmails = [
	{
		email: faker.internet.email(),
		verified: false,
		primary: false,
		visibility: 'public',
	},
	{
		email: faker.internet.email(),
		verified: true,
		primary: false,
		visibility: null,
	},
	primaryGitHubEmail,
]
export const mockGithubProfile = {
	login: faker.internet.userName(),
	id: faker.string.uuid(),
	name: faker.person.fullName(),
	avatar_url: 'https://github.com/ghost.png',
	emails: githubEmails.map(e => e.email),
}

const passthroughGitHub = !process.env.GITHUB_CLIENT_ID.startsWith('MOCK_')

// 🐨 create an EmailSchema here with z.object
// 🐨 an email should have the following strings:
//   to, from, subject, text, html

const handlers = [
	process.env.REMIX_DEV_HTTP_ORIGIN
		? rest.post(`${process.env.REMIX_DEV_HTTP_ORIGIN}ping`, passthrough)
		: null,

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
		const body = (await request.json()) as Record<string, any>
		console.info('🔶 mocked email contents:', body)

		// 🐨 create a directory for the emails
		// 💰 path.join(fixturesDirPath, 'email')
		// 🐨 ensure the directory exists
		// 💰 await fsExtra.ensureDir(dir)
		// 🐨 write the email as json to a json file in the email directory with the
		// filename set to the "to" email address.
		// 💰 await fsExtra.writeJSON(path.join(dir, `./${email.to}.json`), email)

		return json({
			id: faker.string.uuid(),
			// 🐨 if you renamed the body to "email" like I did, you'll need to update
			// these references:
			from: body.from,
			to: body.to,
			created_at: new Date().toISOString(),
		})
	}),

	// test this github stuff out without going through github's oauth flow by
	// going to http://localhost:3000/auth/github/callback?code=MOCK_CODE&state=MOCK_STATE
	rest.post('https://github.com/login/oauth/access_token', async () => {
		if (passthroughGitHub) return passthrough()

		return new Response(
			new URLSearchParams({
				access_token: MOCK_ACCESS_TOKEN,
				token_type: '__MOCK_TOKEN_TYPE__',
			}).toString(),
			{ headers: { 'content-type': 'application/x-www-form-urlencoded' } },
		)
	}),
	rest.get('https://api.github.com/user/emails', async () => {
		if (passthroughGitHub) return passthrough()

		return json(githubEmails)
	}),
	rest.get('https://api.github.com/user/:id', async ({ params }) => {
		if (passthroughGitHub) return passthrough()

		if (mockGithubProfile.id === params.id) {
			return json(mockGithubProfile)
		}

		return new Response('Not Found', { status: 404 })
	}),
	rest.get('https://api.github.com/user', async () => {
		if (passthroughGitHub) return passthrough()

		return json(mockGithubProfile)
	}),
	rest.get('https://github.com/ghost.png', async () => {
		if (passthroughGitHub) return passthrough()

		const buffer = await fs.promises.readFile(
			'./tests/fixtures/images/ghost.jpg',
		)
		return new Response(buffer, {
			// the .png is not a mistake even though it looks like it... It's really a jpg
			// but the ghost image URL really has a png extension 😅
			headers: { 'content-type': 'image/jpg' },
		})
	}),
].filter(Boolean)

export const server = setupServer(...handlers)

server.listen({
	onUnhandledRequest(request, print) {
		if (
			request.url.includes(process.cwd()) ||
			request.url.includes('node_modules')
		) {
			return
		}
		print.warning()
	},
})

if (process.env.NODE_ENV !== 'test') {
	console.info('🔶 Mock server installed')

	closeWithGrace(() => {
		server.close()
	})
}
