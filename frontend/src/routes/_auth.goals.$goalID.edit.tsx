import GoalForm from '#/components/GoalForm'
import { goals } from '#/data/goals'
import { authClient } from '#/lib/auth-client'
import type { NewGoal } from '#/types'
import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/goals/$goalID/edit')({
	component: EditGoal,
	loader: (({params}) => {
		let goal = goals.find((goal) => goal.id === parseInt(params.goalID))
		if (!goal) throw redirect({to: "/"})
		return goal
	})
})

function EditGoal() {
	const { data: session } = authClient.useSession()
	const goal = Route.useLoaderData()

	/* TODO: Change this to edit mutation */
	const newGoalMutationFn = (newGoal: NewGoal) => {
		let dateString;

		if (newGoal.deadline) {
			dateString = new Date(newGoal.deadline).toISOString()
		} else {
			dateString = new Date().toISOString()
		}

		return fetch(import.meta.env.VITE_SERVER + "/goals", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("bearer-token")}`
			},
			body: JSON.stringify({
				...newGoal,
				goalAmount: parseInt(newGoal.goalAmount),
				deadline: dateString,
				userId: session?.user.id,
			})
		})
	}

	return (
		<main className='container mx-auto px-8 flex justify-center pt-16 lg:pt-30'>
			<GoalForm heading='Edit Goal' goal={goal} submitText="Update" mutationFn={newGoalMutationFn} />
		</main>
	)
}
