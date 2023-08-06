import fs from 'node:fs'
import { rest, passthrough, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import closeWithGrace from 'close-with-grace'
import { faker } from '@faker-js/faker'
import { requireHeader, writeEmail } from './utils.ts'

const { json } = HttpResponse

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
const handlers = [
	process.env.REMIX_DEV_HTTP_ORIGIN
		? rest.post(`${process.env.REMIX_DEV_HTTP_ORIGIN}ping`, passthrough)
		: null,

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
