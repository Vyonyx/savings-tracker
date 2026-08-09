import { goals } from '#/data/goals'
import { calculateCurrentAmountFromTransactions } from '#/lib/utils'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { Dot } from 'lucide-react'

export const Route = createFileRoute('/overview/$goalID')({
	component: GoalOverview,
	loader: (({params}) => {
		const goal = goals.find((goal) => goal.id === parseInt(params.goalID))
		if (!goal) throw redirect({to: "/"})
		return goal
	})
})

function GoalOverview() {
	const {name, goalAmount, deadline, transactions} = Route.useLoaderData()
	const currentAmount = calculateCurrentAmountFromTransactions(transactions)
	return (
		<main className='container mx-auto px-8 flex justify-center pt-10'>
			<div className='text-center flex flex-col gap-4'>
				<h1 className='text-4xl'>{name}</h1>
				<div className='card-heading--regular flex justify-center items-center'>
					<p><span>${new Intl.NumberFormat().format(currentAmount)}</span> of <span>${new Intl.NumberFormat().format(goalAmount)}</span></p>
					<Dot className="text-primary/50" />
					<span className="text-primary/50">{deadline ? 'Due ' + Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(deadline)) : 'No deadline'}</span>
				</div>
			</div>
		</main>
	)
}
