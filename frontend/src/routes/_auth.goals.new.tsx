import GoalForm from '#/components/GoalForm'
import { authClient } from '#/lib/auth-client'
import type { GoalFormData, NewGoalBody } from '#/types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/goals/new')({
	component: NewGoalForm,
})

function NewGoalForm() {
	const { data: session } = authClient.useSession()

	const newGoalMutationFn = (newGoal: GoalFormData) => {
		const body: NewGoalBody = {
			name: newGoal.name,
			goalAmount: parseInt(newGoal.goalAmount),
			userId: session?.user.id,
		}

		if (newGoal.deadline) {
			body.deadline = newGoal.deadline.toISOString()
		} else {
			delete body.deadline
		}

		return fetch(import.meta.env.VITE_SERVER + "/goals", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("bearer-token")}`
			},
			body: JSON.stringify(body)
		})
	}

	return (
		<main className='container mx-auto px-8 flex justify-center pt-16 lg:pt-30'>
			<GoalForm heading='New Goal' submitText="Add" mutationFn={newGoalMutationFn} />
		</main>
	)
}
