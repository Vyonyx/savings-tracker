export type TransactionType = "deposit" | "withdrawal"

export type BankAccount = {
	id: number
	name: string
	transactions?: Transaction[]
}

export type Transaction = {
	id: number
	amount: number
	type: TransactionType
	createdAt: string
	updatedAt: string
	userId: number
	goalId: number
	bankAccountId: number
}

export type Goal = {
	id: number
	name: string
	goalAmount: number
	deadline?: string | null
	isComplete: boolean
	createdAt: string
	transactions?: Transaction[]
	bankAccountId: number
}

export type NewBankAccountFormData = Pick<BankAccount, "name">

export type NewTransactionFormData = Pick<Transaction, "amount" | "type">

export type NewGoalFormData = Pick<Goal, "name" | "goalAmount" | "bankAccountId"> & {
	deadline?: Date
}

export type UpdateGoalFormData = Omit<Goal, "deadline" | "transactions"> & {
	deadline?: Date
}

export type NewGoalBody = Pick<Goal, "name" | "goalAmount"> & {
	deadline?: string
}
