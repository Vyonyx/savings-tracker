export type TransactionType = "deposit" | "withdrawal"

export type Transaction = {
	id?: number
	amount: number
	type: TransactionType
	createdAt?: string
	updatedAt?: string
	userId?: number
	goalId?: number
}

export type Goal = {
	id: number
	name: string
	goalAmount: number
	deadline?: string | null
	isComplete: boolean
	createdAt: string
	transactions?: Transaction[]
}

export type NewTransactionFormData = Pick<Transaction, "amount" | "type">

export type NewGoalFormData = Pick<Goal, "name" | "goalAmount"> & {
	deadline?: Date
}

export type UpdateGoalFormData = Omit<Goal, "deadline" | "transactions"> & {
	deadline?: Date
}

export type NewGoalBody = Pick<Goal, "name" | "goalAmount"> & {
	deadline?: string
}
