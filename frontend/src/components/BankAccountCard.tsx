import { calculateCurrentAmountFromTransactions } from "#/lib/utils"
import type { BankAccount } from "#/types"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

type Props = {
	bankAccount: BankAccount
}

function BankAccountCard({ bankAccount }: Props) {
	const {name, transactions} = bankAccount
	const currentAmount = calculateCurrentAmountFromTransactions(transactions)
	return (
		<li>
			<Card className="bg-linear-to-r from-black to-[#101010]">
				<CardHeader>
					<CardTitle className="card-heading--regular">
						<span className="">{name}</span>
					</CardTitle>
				</CardHeader>

				<CardContent>
					<span className="stat-number--small text-green">${new Intl.NumberFormat().format(currentAmount)}</span>
				</CardContent>
			</Card>
		</li>
	)
}

export default BankAccountCard
