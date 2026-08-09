import type { Transaction } from '#/types'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const calculateCurrentAmountFromTransactions = (transactions: Transaction[] | undefined): number => {
	return transactions ? transactions.reduce((total, transaction) => {
		if (transaction.type === "deposit") return total + transaction.amount
			else if (transaction.type === "withdrawal") return total - transaction.amount
		return total
	}, 0) : 0;
} 
