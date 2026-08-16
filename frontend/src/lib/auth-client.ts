import { createAuthClient } from 'better-auth/react'

export const authClient = createAuthClient({
	fetchOptions: {
		onSuccess: (ctx) => {
			const signedToken = ctx.response.headers.get("set-auth-token")
			if (signedToken) {
				const bearerToken = signedToken?.split(".")[0]
				localStorage.setItem("bearer-token", bearerToken)
			}
		}
	},
})
