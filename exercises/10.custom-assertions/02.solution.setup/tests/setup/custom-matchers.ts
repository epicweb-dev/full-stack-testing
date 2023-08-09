import { expect } from 'vitest'

expect.extend({
	toHaveRedirect(response: Response, redirectTo: string) {
		const isRedirectStatusCode = response.status >= 300 && response.status < 400
		if (!isRedirectStatusCode) {
			return {
				pass: false,
				message: () =>
					`Expected redirect to ${
						this.isNot ? 'not ' : ''
					}be ${redirectTo} but got ${response.status}`,
			}
		}
		const location = response.headers.get('location')
		return {
			pass: location === redirectTo,
			message: () =>
				`Expected redirect to ${
					this.isNot ? 'not ' : ''
				}be ${redirectTo} but got ${location}`,
		}
	},
})

interface CustomMatchers<R = unknown> {
	toHaveRedirect(redirectTo: string): R
}

declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers<T> {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
