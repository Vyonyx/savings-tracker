import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { FieldSet, FieldGroup, Field, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import type { Goal, GoalFormData } from "#/types"
import { handleInputChange } from "#/lib/utils"
import { useMutation, useQueryClient, type MutationFunction } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { format } from "date-fns"
import { Calendar } from "./ui/calendar"

type Props = {
	heading: string
	goal?: Goal
	submitText: string
	mutationFn: MutationFunction<Response, GoalFormData> | MutationFunction<Response>
}

function GoalForm({ heading, goal, submitText, mutationFn }: Props) {
	const [newGoal, setNewGoal] = useState<GoalFormData>({
		name: goal?.name ?? "",
		goalAmount: goal?.goalAmount.toString() ?? "",
		deadline: goal?.deadline ? new Date(goal.deadline) : undefined
	})

	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const mutation = useMutation({
		mutationFn,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["goals"] })
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
		<Card className='w-full lg:w-6/12'>
			<CardHeader>
				<CardTitle>
					<h1 className='text-2xl text-center'>{heading}</h1>
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
									<Button variant="orange" size="lg" type="submit">{submitText}</Button>
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>
				</CardContent>
			</CardHeader>
		</Card>
	)
}

export default GoalForm
