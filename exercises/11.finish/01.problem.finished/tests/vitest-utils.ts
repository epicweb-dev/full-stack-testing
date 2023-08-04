import { sessionKey } from '~/utils/auth.server.ts'
import { sessionStorage } from '~/utils/session.server.ts'

export const BASE_URL = 'https://www.epicstack.dev'

export async function getSessionSetCookieHeader(
	session: { id: string },
	existingCookie?: string,
) {
	const cookieSession = await sessionStorage.getSession(existingCookie)
	cookieSession.set(sessionKey, session.id)
	const setCookieHeader = await sessionStorage.commitSession(cookieSession)
	return setCookieHeader
}
