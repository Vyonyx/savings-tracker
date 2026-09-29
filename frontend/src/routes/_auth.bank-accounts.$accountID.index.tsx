import TransactionCard from '#/components/Transaction'
import { singleBankAccountQueryOptions } from '#/lib/queries/goals'
import { calculateCurrentAmountFromTransactions } from '#/lib/utils'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import clsx from 'clsx'

export const Route = createFileRoute('/_auth/bank-accounts/$accountID/')({
	component: BankAccountOverview,
	loader: ({ context, params }) => {
		const id = parseInt(params.accountID)
		context.queryClient.ensureQueryData(singleBankAccountQueryOptions(id))
	},
})

function BankAccountOverview() {
	const { accountID } = Route.useParams()
	const { data: bankAccount } = useQuery(singleBankAccountQueryOptions(parseInt(accountID)))

	if (!bankAccount) return <h1>No bank account found.</h1>

	const { name, transactions } = bankAccount
	const currentAmount = calculateCurrentAmountFromTransactions(transactions)

	return (
		<main className='container mx-auto px-8 flex flex-col items-center gap-y-10 pt-10'>
			<div className='text-center flex flex-col gap-4'>
				<h1 className='text-4xl'>{name}</h1>
				<span className={clsx(
					'stat-number--small', 
					{
						'text-green': currentAmount > 0,
						'text-orange' : currentAmount < 0,
						'text-primary' : currentAmount === 0,
					}
				)}>
					${new Intl.NumberFormat().format(currentAmount)}
				</span>
			</div>

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
