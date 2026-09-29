import { calculateCurrentAmountFromTransactions } from "#/lib/utils"
import type { BankAccount } from "#/types"
import { Link } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { List } from "lucide-react"

type Props = {
	bankAccount: BankAccount
}

function BankAccountCard({ bankAccount }: Props) {
	const {id, name, transactions} = bankAccount
	const currentAmount = calculateCurrentAmountFromTransactions(transactions)
	return (
		<li>
			<Card className="bg-linear-to-r from-black to-[#101010]">
				<CardHeader className="flex justify-between items-center">
					<CardTitle className="card-heading--regular">
						<span className="">{name}</span>
					</CardTitle>

					<Link to="/bank-accounts/$accountID" params={{accountID: id.toString()}}>
						<List className="text-primary/50 hover:text-primary transition-colors" size={16}></List>
					</Link>
				</CardHeader>

				<CardContent>
					<span className="stat-number--small text-green">${new Intl.NumberFormat().format(currentAmount)}</span>
				</CardContent>
			</Card>
		</li>
	)
}

export default BankAccountCard
