import GoalForm from '#/components/GoalForm'
import { authClient } from '#/lib/auth-client'
import { singleGoalQueryOptions } from '#/lib/queries/goals'
import type { GoalFormData } from '#/types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/goals/$goalID/edit')({
	component: EditGoalForm,
	loader: (({ context, params }) => {
		context.queryClient.ensureQueryData(singleGoalQueryOptions(parseInt(params.goalID)))
	})
})

function EditGoalForm() {
	const { data: session } = authClient.useSession()
	const { goalID } = Route.useParams()
	const { data: goal } = useQuery(singleGoalQueryOptions(parseInt(goalID)))

	/* TODO: Change this to edit mutation */
	const newGoalMutationFn = (newGoal: GoalFormData) => {
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
