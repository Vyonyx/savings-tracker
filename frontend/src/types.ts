export type TransactionType = "deposit" | "withdrawal"

export type Transaction = {
	id: number
	amount: number
	type: TransactionType
	date: string
}

export type NewTransaction = {
	amount: number
	type: TransactionType
}

export type Goal = {
	id: number
	name: string
	goalAmount: number
	deadline?: string
	isComplete: boolean
	createdAt: string
	transactions?: Transaction[]
}

export type NewGoal = {
	name: string
	goalAmount: number
	deadline?: string
}
