import { useState, type ChangeEvent } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { FieldSet, FieldGroup, Field, FieldLabel } from "./ui/field"
import { Input } from "./ui/input"
import type { NewGoal } from "#/types"

type Props = {
	heading: string
}

function GoalForm({ heading }: Props) {
	const [newGoal, setNewGoal] = useState<NewGoal>({
		name: "",
		goalAmount: 0,
		deadline: "",
	})

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const id = e.target.id
		const value = e.target.value
		setNewGoal((prev) => {
			return {...prev, [id]: value}
		})
	}

  return (
			<Card className='w-full lg:w-6/12'>
				<CardHeader>
					<CardTitle>
						<h1 className='text-2xl text-center'>{heading}</h1>
					</CardTitle>

					<CardContent className='mt-4'>
						<form>
							<FieldSet>
								<FieldGroup>
									<Field>
										<FieldLabel htmlFor='name'>Name</FieldLabel>
										<Input id='name' type="text" placeholder="Name" value={newGoal.name} onChange={handleChange} />
									</Field>

									<Field>
										<FieldLabel htmlFor='goalAmount'>Goal Amount</FieldLabel>
										<Input id='goalAmount' type="text" placeholder="0" value={newGoal.goalAmount} onChange={handleChange} />
									</Field>

									<Field>
										<FieldLabel htmlFor='deadline'>Deadline</FieldLabel>
										<Input id='deadline' type="text" placeholder="2026-01-02" value={newGoal.deadline} onChange={handleChange} />
									</Field>

									<Field className='w-40 mx-auto mt-4'>
										<Button variant="orange" size="lg" type="submit">Add</Button>
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
