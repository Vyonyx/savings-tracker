import BankAccountCard from '#/components/BankAccountCard'
import { Button } from '#/components/ui/button'
import { bankAccountsQueryOptions } from '#/lib/queries/goals'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/bank-accounts/')({
  component: RouteComponent,
	loader: async ({ context }) => {
		context.queryClient.ensureQueryData(bankAccountsQueryOptions)
	},
})

function RouteComponent() {
	const { data: bankAccounts } = useQuery(bankAccountsQueryOptions)
	if (!bankAccounts) return (
		<main className='container mx-auto p-8 flex flex-col items-center gap-y-4'>
			<h1 className='text-xl'>No Bank Accounts Found.</h1>

			<Button asChild variant='orange'>
				<Link to='/goals'>Back to Goals</Link>
			</Button>
		</main>
	)

	return (
		<main className='container mx-auto p-8'>
			{bankAccounts.length ? (
				<ul className='grid md:grid-cols2 lg:grid-cols-3 gap-4'>
					{bankAccounts.map((account) => <BankAccountCard bankAccount={account} />)}
				</ul>
			) : (
			<h1 className='text-2xl text-center'>No Bank Accounts, create one.</h1>
			)}
		</main>
	)
}
