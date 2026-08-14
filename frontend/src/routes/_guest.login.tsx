import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card'
import { Field, FieldGroup, FieldLabel, FieldSet } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { handleInputChange } from '#/lib/utils'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { authClient } from "@/lib/auth-client"; //import the auth client

export const Route = createFileRoute('/_guest/login')({
	component: SignIn,
})

type SignInDetails = {
	email: string
	password: string
}

function SignIn() {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)
	const [details, setDetails] = useState<SignInDetails>({
		email: "",
		password: "",
	})

	const handleSubmit = async (e: React.SubmitEvent) => {
		e.preventDefault()

		await authClient.signIn.email({
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
						<h1 className='text-2xl text-center'>Sign In</h1>
					</CardTitle>
				</CardHeader>

				<CardContent>
					<form onSubmit={handleSubmit}>
						<FieldSet>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor='email'>Email</FieldLabel>
									<Input id='email' type='email' value={details.email} onChange={(e) => handleInputChange(e, setDetails)} />
								</Field>

								<Field>
									<FieldLabel htmlFor='password'>Password</FieldLabel>
									<Input id='password' type='password' value={details.password} onChange={(e) => handleInputChange(e, setDetails)} />
								</Field>

								<Field className='w-40 mx-auto mt-4'>
									<Button variant="orange" size="lg" type="submit">Sign In</Button>
								</Field>
							</FieldGroup>
						</FieldSet>
					</form>
				</CardContent>
			</Card>
		</main>
	)
}
