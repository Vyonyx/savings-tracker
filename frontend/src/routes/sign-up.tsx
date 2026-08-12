import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { handleInputChange } from '#/lib/utils'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from "@/lib/auth-client"; //import the auth client

export const Route = createFileRoute('/sign-up')({
	component: Signup,
})

type SignupDetails = {
	name: string
	email: string
	password: string
}

function Signup() {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [details, setDetails] = useState<SignupDetails>({
		name: "",
		email: "",
		password: "",
	})

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault()

		await authClient.signUp.email({
			...details
		}, {
				onRequest: () => {
					setLoading(true)
				},
				onSuccess: () => {
					setLoading(false)
					navigate({to: "/"})
				},
				onError: (ctx) => {
					setLoading(false)
					alert(ctx.error.message);
				},
			});

	}

	if (loading) return (
	<h1 className='text-2xl text-center mt-10'>Loading...</h1>
	)

	return (
		<main className='container mx-auto px-8 flex justify-center pt-16 lg:pt-30'>
			<Card className='w-full lg:w-6/12'>
				<CardHeader>
					<CardTitle>
						<h1 className='text-2xl text-center'>Sign Up</h1>
					</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldSet>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor='name'>Name</FieldLabel>
									<Input id='name' type='text' value={details.name} onChange={(e) => handleInputChange(e, setDetails)} />
								</Field>

								<Field>
									<FieldLabel htmlFor='email'>Email</FieldLabel>
									<Input id='email' type='email' value={details.email} onChange={(e) => handleInputChange(e, setDetails)} />
								</Field>

								<Field>
									<FieldLabel htmlFor='password'>Password</FieldLabel>
									<Input id='password' type='password' value={details.password} onChange={(e) => handleInputChange(e, setDetails)} />
								</Field>

								<Field className='w-40 mx-auto mt-4'>
									<Button variant="orange" size="lg" type="submit">Sign Up</Button>
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>
				</CardContent>
			</Card>
		</main>
	)
}
