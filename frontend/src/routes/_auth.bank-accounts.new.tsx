import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { FieldSet, FieldGroup, Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { handleInputChange } from '#/lib/utils'
import type { NewBankAccountFormData } from '#/types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/_auth/bank-accounts/new')({
	component: NewBankAccountForm,
})

function NewBankAccountForm() {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const [newBankAccount, setNewBankAccount] = useState<NewBankAccountFormData>({
		name: "",
	})

	const mutation = useMutation({
		mutationFn: async (body: NewBankAccountFormData) => {
			await fetch(import.meta.env.VITE_SERVER + "/bank-accounts", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("bearer-token")}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(body)
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({queryKey: ["bank-accounts"]})
			navigate({ to: "/bank-accounts" })
		},
		onError: (error) => {
			console.error("Faild to create bank account: ", error)
		},
	})

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault()
		mutation.mutate(newBankAccount)
	}

	return (
		<main className='container mx-auto px-8 flex justify-center pt-16 lg:pt-30'>
			<Card className='w-full lg:w-6/12'>
				<CardHeader>
					<CardTitle>
						<h1 className='text-2xl text-center'>New Bank Account</h1>
					</CardTitle>
				</CardHeader>

				<CardContent className='mt-4'>
					<form onSubmit={(e) => handleSubmit(e)}>
						<FieldSet>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor='name'>Name</FieldLabel>
									<Input id='name' type="text" placeholder="Name" value={newBankAccount.name} onChange={(e) => handleInputChange(e, setNewBankAccount)} />
								</Field>

								<Field className='w-40 mx-auto mt-4'>
									<Button variant="green" size="lg" type="submit">Add</Button>
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>
				</CardContent>
			</Card>
		</main>
	)
}
