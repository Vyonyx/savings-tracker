import GoalForm from '#/components/GoalForm'
import { goals } from '#/data/goals'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/edit/$goalID')({
	component: EditGoal,
	loader: (({params}) => {
		let goal = goals.find((goal) => goal.id === parseInt(params.goalID))
		if (!goal) throw redirect({to: "/"})
		return goal
	})
})

function EditGoal() {
	const goal = Route.useLoaderData()

	return (
		<main className='container mx-auto px-8 flex justify-center pt-16 lg:pt-30'>
			<GoalForm heading='Edit Goal' goal={goal} submitText="Update" />
		</main>
	)
}
