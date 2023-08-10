import { expect } from 'vitest'

expect.extend({
	toHaveRedirect(response: Response, redirectTo?: string) {
		const location = response.headers.get('location')
		const redirectToSupplied = redirectTo !== undefined
		if (redirectToSupplied !== Boolean(location)) {
			return {
				pass: Boolean(location),
				message: () =>
					`Expected response to ${this.isNot ? 'not ' : ''}redirect${
						redirectToSupplied
							? ` to ${this.utils.printExpected(redirectTo)}`
							: ''
					} but got ${
						location ? 'no redirect' : this.utils.printReceived(location)
					}`,
			}
		}
		const isRedirectStatusCode = response.status >= 300 && response.status < 400
		if (!isRedirectStatusCode) {
			return {
				pass: false,
				message: () =>
					`Expected redirect to ${
						this.isNot ? 'not ' : ''
					}be ${this.utils.printExpected(
						'>= 300 && < 400',
					)} but got ${this.utils.printReceived(response.status)}`,
			}
		}

		return {
			pass: location === redirectTo,
			message: () =>
				`Expected response to ${
					this.isNot ? 'not ' : ''
				}redirect to ${this.utils.printExpected(
					redirectTo,
				)} but got ${this.utils.printReceived(location)}`,
		}
	},
})

interface CustomMatchers<R = unknown> {
	toHaveRedirect(redirectTo: string | null): R
}

declare module 'vitest' {
	interface Assertion<T = any> extends CustomMatchers<T> {}
	interface AsymmetricMatchersContaining extends CustomMatchers {}
}
