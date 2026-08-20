import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { FieldGroup, FieldLabel, FieldSet, Field } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '#/components/ui/popover'
import { singleGoalQueryOptions } from '#/lib/queries/goals'
import { handleInputChange } from '#/lib/utils'
import type { UpdateGoalFormData } from '#/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Calendar } from '#/components/ui/calendar'
import { format } from 'date-fns'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/goals/$goalID/edit')({
	component: EditGoalForm,
	loader: (({ context, params }) => {
		context.queryClient.ensureQueryData(singleGoalQueryOptions(parseInt(params.goalID)))
	})
})

function EditGoalForm() {
	const { goalID } = Route.useParams()
	const { data: goal } = useQuery(singleGoalQueryOptions(parseInt(goalID)))

	if (!goal) return <h1>No Goal Found.</h1>

	const [newGoal, setNewGoal] = useState<UpdateGoalFormData>({
		...goal,
		goalAmount: goal.goalAmount.toString(),
		deadline: goal.deadline ? new Date(goal.deadline) : undefined
	})

	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const updateGoalMutationFn = (updatedGoal: UpdateGoalFormData) => {
		const body = {...updatedGoal, goalAmount: parseInt(updatedGoal.goalAmount)}
		return fetch(import.meta.env.VITE_SERVER + `/goals/${updatedGoal}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("bearer-token")}`
			},
			body: JSON.stringify(body)
		})
	}

	const mutation = useMutation({
		mutationFn: updateGoalMutationFn,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["goals", goal.id] })
			navigate({ to: "/goals" })
		},
		onError: (error) => {
			console.error("Failed to create goal: ", error)
		},
	})

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		mutation.mutate(newGoal)
	}

	return (
		<main className='container mx-auto px-8 flex justify-center pt-16 lg:pt-30'>
			<Card className='w-full lg:w-6/12'>
				<CardHeader>
					<CardTitle>
						<h1 className='text-2xl text-center'>New Goal</h1>
					</CardTitle>

					<CardContent className='mt-4'>
						<form onSubmit={(e) => handleSubmit(e)}>
							<FieldSet>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor='name'>Name</FieldLabel>
										<Input id='name' type="text" placeholder="Name" value={newGoal.name} onChange={(e) => handleInputChange(e, setNewGoal)} />
									</Field>

									<Field>
										<FieldLabel htmlFor='goalAmount'>Goal Amount</FieldLabel>
										<Input id='goalAmount' type="text" placeholder="0" value={newGoal.goalAmount} onChange={(e) => handleInputChange(e, setNewGoal)} />
									</Field>

									<Field>
										<FieldLabel htmlFor='deadline'>Deadline</FieldLabel>
										<Popover>
											<PopoverTrigger asChild>
												<Button variant="outline">{ newGoal.deadline ? format(newGoal.deadline, "PPP") : <span>Pick a date</span> }</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar 
													mode="single"
													selected={newGoal.deadline}
													onSelect={(newDate) => setNewGoal((prev) => ({...prev, deadline: newDate}))}
													defaultMonth={newGoal.deadline}
												/>
											</PopoverContent>
										</Popover>
									</Field>

									<Field className='w-40 mx-auto mt-4'>
										<Button variant="orange" size="lg" type="submit">Update</Button>
									</Field>
								</FieldGroup>
							</FieldSet>
						</form>
					</CardContent>
				</CardHeader>
			</Card>
		</main>
	)
}
