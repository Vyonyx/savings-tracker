export type TransactionType = "deposit" | "withdrawal"

export type Transaction = {
	id: number
	amount: number
	type: TransactionType
	createdAt: string
}

export type NewTransaction = {
	amount: string
	type: TransactionType
}

export type Goal = {
	id: number
	name: string
	goalAmount: number
	deadline: string | null
	isComplete: boolean
	createdAt: string
	transactions?: Transaction[]
}

export type GoalFormData = {
	name: string
	goalAmount: string
	deadline?: Date
}

export type NewGoalBody = {
	name: string
	goalAmount: number
	deadline?: string
	userId?: string
}
