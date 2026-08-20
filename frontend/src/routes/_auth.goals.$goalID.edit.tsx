import GoalForm from '#/components/GoalForm'
import { singleGoalQueryOptions } from '#/lib/queries/goals'
import type { Goal } from '#/types'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/goals/$goalID/edit')({
	component: EditGoalForm,
	loader: (({ context, params }) => {
		context.queryClient.ensureQueryData(singleGoalQueryOptions(parseInt(params.goalID)))
	})
})

function EditGoalForm() {
	const { goalID } = Route.useParams()
	const { data: goal } = useQuery(singleGoalQueryOptions(parseInt(goalID)))

	const updateGoalMutationFn = (updatedGoal: Goal) => {
		return fetch(import.meta.env.VITE_SERVER + `/goals/${updatedGoal}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("bearer-token")}`
			},
			body: JSON.stringify(updatedGoal)
		})
	}

	return (
		<main className='container mx-auto px-8 flex justify-center pt-16 lg:pt-30'>
			<GoalForm heading='Edit Goal' goal={goal} submitText="Update" mutationFn={updateGoalMutationFn} />
		</main>
	)
}
