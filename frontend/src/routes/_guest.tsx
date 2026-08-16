import { authClient } from '#/lib/auth-client'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_guest')({
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession()
		if (session) {
			throw redirect({ to: "/goals" })
		}
	},
	component: () => <Outlet />,
})
