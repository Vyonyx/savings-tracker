import TransactionCard from '#/components/Transaction'
import { Button } from '#/components/ui/button'
import { Field, FieldGroup, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '#/components/ui/select'
import { singleGoalQueryOptions } from '#/lib/queries/goals'
import { calculateCurrentAmountFromTransactions, handleInputChange } from '#/lib/utils'
import type { NewTransactionFormData, TransactionType } from '#/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Dot } from 'lucide-react'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/goals/$goalID/')({
	component: GoalOverview,
	loader: (({ context, params }) => {
		context.queryClient.ensureQueryData(singleGoalQueryOptions(parseInt(params.goalID)))
	})
})

function GoalOverview() {
	const { goalID } = Route.useParams()
	const { data: goal } = useQuery(singleGoalQueryOptions(parseInt(goalID)))
	if (!goal) return <h1>No Goal Found.</h1>
	const navigate = useNavigate()
	const queryClient = useQueryClient()
	const {name, goalAmount, deadline, transactions} = goal

	const [newTransaction, setNewTransaction] = useState<NewTransactionFormData>({
		amount: 0,
		type: "deposit",
	})

	const mutation = useMutation({
		mutationFn: async (newTransaction: NewTransactionFormData) => {
			const body = {...newTransaction, amount: newTransaction.amount, goalId: goal.id}
			await fetch(import.meta.env.VITE_SERVER + "/transactions", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("bearer-token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body),
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals"] })
			navigate({ to: "/goals" })
		},
		onError: (error) => {
			throw new Error(`Failed to create new transaction: ${error}`)
		},
	})

	const handleFormSubmit = (e: React.SubmitEvent) => {
		e.preventDefault()
		mutation.mutate(newTransaction)
	}

	const currentAmount = calculateCurrentAmountFromTransactions(transactions)
	return (
		<main className='container mx-auto px-8 flex flex-col items-center gap-y-10 pt-10'>
			<div className='text-center flex flex-col gap-4'>
				<h1 className='text-4xl'>{name}</h1>
				<div className='card-heading--regular flex justify-center items-center'>
					<p><span>${new Intl.NumberFormat().format(currentAmount)}</span> of <span>${new Intl.NumberFormat().format(goalAmount)}</span></p>
					<Dot className="text-primary/50" />
					<span className="text-primary/50">{deadline ? 'Due ' + Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(deadline)) : 'No deadline'}</span>
				</div>
			</div>

			<form className='w-full lg:w-9/12' onSubmit={handleFormSubmit}>
				<FieldSet>
					<FieldGroup className='flex flex-col md:flex-row items-center md:items-end gap-y-6 gap-x-4'>
						<Field>
							<FieldLabel htmlFor="amount">Amount</FieldLabel>
							<Input id="amount" type="text" value={newTransaction.amount} onChange={(e) => handleInputChange(e, setNewTransaction, true)} />
						</Field>

						<Field>
							<FieldLabel>Type</FieldLabel>
							<Select onValueChange={(type: TransactionType) => {
								setNewTransaction((prev) => {
									return {...prev, type: type}
								})
							}}>
								<SelectTrigger className='w-40'>
									<SelectValue placeholder="Deposit" />
								</SelectTrigger>

								<SelectContent>
									<SelectGroup>
										<SelectItem value="deposit" defaultChecked={true}>Deposit</SelectItem>
										<SelectItem value="withdrawal">Withdrawal</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
						</Field>

						<Field className='w-60'>
							<Button variant="orange" size="lg">Add</Button>
						</Field>
					</FieldGroup>
				</FieldSet>
			</form>

			{transactions ? (
				<ul className='w-full lg:w-9/12'>
					{transactions.map((t) => <TransactionCard key={t.id} transaction={t} />)}
				</ul>
			) : (
					<h2 className='text-2xl'>No transactions yet.</h2>
				)}
		</main>
	)
}
