import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import type { NewGoal } from '#/types'
import { createFileRoute } from '@tanstack/react-router'
import { useState} from 'react'
import { type ChangeEvent } from 'react'

export const Route = createFileRoute('/new')({
	component: NewGoal,
})

function NewGoal() {
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
		<main className='container mx-auto px-8 flex justify-center pt-16 lg:pt-30'>
			<Card className='w-6/12'>
				<CardHeader>
					<CardTitle>
						<h1 className='text-2xl text-center'>New Goal</h1>
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
		</main>
	)
}
