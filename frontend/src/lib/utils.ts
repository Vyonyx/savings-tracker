import type { Transaction } from '#/types'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import type { ChangeEvent, SetStateAction } from 'react'
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

	export const handleInputChange = <T>(e: ChangeEvent<HTMLInputElement>, setFn: React.Dispatch<SetStateAction<T>>) => {
		const id = e.target.id
		const value = e.target.value
		setFn((prev) => {
			return {...prev, [id]: value}
		})
	}
