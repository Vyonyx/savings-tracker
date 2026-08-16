import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { FieldSet, FieldGroup, Field, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import type { Goal, NewGoal } from "#/types"
import { handleInputChange } from "#/lib/utils"
import { useMutation, type MutationFunction } from "@tanstack/react-query"

type Props = {
	heading: string
	goal?: Goal
	submitText: string
	mutationFn: MutationFunction<Response, NewGoal>
}

function GoalForm({ heading, goal, submitText, mutationFn }: Props) {
	const [newGoal, setNewGoal] = useState<NewGoal>({
		name: goal?.name ?? "",
		goalAmount: goal?.goalAmount ?? 0,
		deadline: goal?.deadline ?? "",
	})

	const mutation = useMutation({
		mutationFn
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
									<Input id='deadline' type="text" placeholder="2026-01-02" value={newGoal.deadline} onChange={(e) => handleInputChange(e, setNewGoal)} />
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
