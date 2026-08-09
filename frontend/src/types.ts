export type Transaction = {
	id: number
	amount: number
	type: "deposit" | "withdrawal"
	date: string
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
