import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { FieldLabel, Field, FieldGroup, FieldSet,  } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Popover, PopoverTrigger, PopoverContent } from '#/components/ui/popover'
import { handleInputChange } from '#/lib/utils'
import type { NewGoalFormData, NewGoalBody } from '#/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Calendar } from '#/components/ui/calendar'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { bankAccountsQueryOptions } from '#/lib/queries/goals'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'

export const Route = createFileRoute('/_auth/goals/new')({
	component: NewGoalForm,
	loader: ({ context }) => {
		context.queryClient.ensureQueryData(bankAccountsQueryOptions)
	},
})

function NewGoalForm() {
	const { data: bankAccounts } = useQuery(bankAccountsQueryOptions)

	const [newGoal, setNewGoal] = useState<NewGoalFormData>({
		name: "",
		goalAmount: 0,
		bankAccountId: undefined,
		deadline: undefined
	})
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	useEffect(() => {
		if (bankAccounts && newGoal.bankAccountId === undefined) {
			setNewGoal((prev) => {
				return {...prev, bankAccountId: bankAccounts[0].id}
			})
		}
	}, [bankAccounts])

	const newGoalMutationFn = (newGoal: NewGoalFormData) => {
		const body: NewGoalBody = {
			name: newGoal.name,
			goalAmount: newGoal.goalAmount,
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

	const mutation = useMutation({
		mutationFn: newGoalMutationFn,
		onSuccess: async () => {
			await queryClient.invalidateQueries({ queryKey: ["goals"] })
			navigate({ to: "/goals" })
		},
		onError: (error) => {
			console.error("Failed to create goal: ", error)
		},
	})

	if (!bankAccounts) return (
		<main className='container mx-auto px-8 flex flex-col items-center gap-y-6 pt-16'>
			<p className='text-lg'>Cannot create a new goal without having an existing bank account.</p>
			<Button asChild variant="green" size="lg">
				<Link to="/bank-accounts/new">Create Bank Account</Link>
			</Button>
		</main>
	)

	const handleSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		mutation.mutate(newGoal)
	}

	return (
		<main className='container mx-auto px-8 flex justify-center pt-16'>
			<Card className='w-full lg:w-8/12'>
				<CardHeader>
					<CardTitle>
						<h1 className='text-2xl text-center'>New Goal</h1>
					</CardTitle>
				</CardHeader>

				<CardContent className='mt-4'>
					<form onSubmit={(e) => handleSubmit(e)}>
						<FieldSet>
							<FieldGroup className='grid lg:grid-cols-2'>
								<Field>
									<FieldLabel htmlFor='name'>Name</FieldLabel>
									<Input id='name' type="text" placeholder="Name" value={newGoal.name} onChange={(e) => handleInputChange(e, setNewGoal)} />
								</Field>

								<Field>
									<FieldLabel htmlFor='goalAmount'>Goal Amount</FieldLabel>
									<Input id='goalAmount' type="text" placeholder="0" value={newGoal.goalAmount} onChange={(e) => handleInputChange(e, setNewGoal, true)} />
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

								<Field>
									<FieldLabel htmlFor='bankAccountId'>Bank Account</FieldLabel>
									<Select onValueChange={(accountId: string) => {
										setNewGoal((prev) => {
											return {...prev, bankAccountId: parseInt(accountId)}
										})
									}}>
										<SelectTrigger className='w-40'>
											<SelectValue placeholder={bankAccounts[0].name}/>
										</SelectTrigger>

										<SelectContent>
											<SelectGroup>
												{bankAccounts.map((account, idx) => (
													<SelectItem value={account.id.toString()} defaultChecked={idx === 0}>{account.name}</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</Field>

								<Field className='lg:col-span-2 w-40 mx-auto mt-4'>
									<Button variant="orange" size="lg" type="submit">Add</Button>
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>
				</CardContent>
			</Card>
		</main>
	)
}
