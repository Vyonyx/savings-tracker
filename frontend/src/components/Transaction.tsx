import type { Transaction } from "#/types"
import clsx from "clsx"
import { MinusIcon, PlusIcon } from "lucide-react"

type Props = {
	transaction: Transaction
}

function TransactionCard({ transaction }: Props) {
	const { amount, type, createdAt: date } = transaction
	return (
		<li className="flex justify-between items-center border-b border-b-primary/25 py-4">
			<div className={
				clsx("card-heading--regular flex gap-x-2 items-center", {"text-green": type === "deposit"}, {"text-orange": type === "withdrawal"})
			}>
				{type === "deposit" ? (<PlusIcon size={12} />) : (<MinusIcon size={12} />)}
				<span>${Intl.NumberFormat().format(amount)}</span>
			</div>
			<span className="card-heading--small text-primary/50">{Intl.DateTimeFormat().format(new Date(date))}</span>
		</li>
	)
}

export default TransactionCard
