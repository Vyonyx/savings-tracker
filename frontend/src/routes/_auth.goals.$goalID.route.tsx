import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/goals/$goalID')({
  component: () => <Outlet />,
})
