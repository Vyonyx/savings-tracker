import GoalForm from '#/components/GoalForm'
import type { NewGoal } from '#/types'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/goals/new')({
	component: NewGoal,
})

function NewGoal() {

	return (
		<main className='container mx-auto px-8 flex justify-center pt-16 lg:pt-30'>
			<GoalForm heading='New Goal' submitText="Add" />
		</main>
	)
}
