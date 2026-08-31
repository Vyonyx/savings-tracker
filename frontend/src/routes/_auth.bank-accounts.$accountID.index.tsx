import TransactionCard from '#/components/Transaction'
import { singleBankAccountQueryOptions } from '#/lib/queries/goals'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/bank-accounts/$accountID/')({
  component: BankAccountOverview,
	beforeLoad: ({ context, params }) => {
		const id = parseInt(params.accountID)
		context.queryClient.ensureQueryData(singleBankAccountQueryOptions(id))
	},
})

function BankAccountOverview() {
	const { accountID } = Route.useParams()
	const { data: bankAccount } = useQuery(singleBankAccountQueryOptions(parseInt(accountID)))
	if (!bankAccount) return <h1>No bank account found.</h1>
	const { name, transactions } = bankAccount

	return (
		<main className='container mx-auto px-8'>
			<h1 className='card-heading--regular text-center'>{name}</h1>

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
