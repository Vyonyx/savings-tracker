import { Button } from '#/components/ui/button'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<main className='container px-8 py-10 mx-auto flex flex-col gap-y-10 items-center'>
			<h1 className='text-4xl text-center'>Dashboard</h1>

			<Button asChild variant="orange" size="lg">
				<Link to="/goals">Goals</Link>
			</Button>
		</main>
	)
}
