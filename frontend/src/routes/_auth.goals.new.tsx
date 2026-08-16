import GoalForm from '#/components/GoalForm'
import { authClient } from '#/lib/auth-client'
import type { NewGoal } from '#/types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/goals/new')({
	component: NewGoal,
})

function NewGoal() {
	const { data: session } = authClient.useSession()

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
			<GoalForm heading='New Goal' submitText="Add" mutationFn={newGoalMutationFn} />
		</main>
	)
}
