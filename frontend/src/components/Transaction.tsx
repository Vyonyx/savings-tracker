import type { Transaction } from "#/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import clsx from "clsx"
import { MinusIcon, PlusIcon, Trash2 } from "lucide-react"
import { toast } from "sonner"

type Props = {
	transaction: Transaction
}

function TransactionCard({ transaction }: Props) {
	const { id, amount, type, createdAt: date, goalId } = transaction
	const queryClient = useQueryClient()

	const mutation = useMutation({
		mutationFn: async (id: number) => {
			fetch(import.meta.env.VITE_SERVER + "/transactions/" + id, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${localStorage.getItem("bearer-token")}`
				},
			})
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["goals", goalId] })
		},
		onError: () => {
			toast("Could not delete transaction", {
				position: "bottom-center",
			})
		},
	})

	return (
		<li className="relative flex justify-between items-center border-b border-b-primary/25 py-4">
			<div className={
				clsx("card-heading--regular flex gap-x-2 items-center", {"text-green": type === "deposit"}, {"text-orange": type === "withdrawal"})
			}>
				{type === "deposit" ? (<PlusIcon size={12} />) : (<MinusIcon size={12} />)}
				<span>${Intl.NumberFormat().format(amount)}</span>
			</div>

			<div className="flex items-center gap-x-4">
				{date && (
					<span className="card-heading--small text-primary/50">{Intl.DateTimeFormat().format(new Date(date))}</span>
				)}
				<button 
					className="cursor-pointer text-primary/50 lg:hover:text-primary"
					onClick={() => mutation.mutate(id) }
				>
					<Trash2 size={16} />
				</button>
			</div>
		</li>
	)
}

export default TransactionCard
