export type Transaction = {
	id?: number
	amount: number
	type: "deposit" | "withdrawal"
	date: string
}

export type Goal = {
	id?: number
	name: string
	goalAmount: number
	deadline?: string
	isComplete: boolean
	transactions?: Transaction[]
}
