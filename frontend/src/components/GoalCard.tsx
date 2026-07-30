import { Progress } from "./ui/progress"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import type { Goal } from "#/types"
import clsx from "clsx"

export const GoalCard = ({ index, goal }: { index: number, goal: Goal }) => {
	const { name, goalAmount, deadline, transactions } = goal

	const currentAmount = transactions ? transactions.reduce((total, transaction) => {
		if (transaction.type === "deposit") return total + transaction.amount
			else if (transaction.type === "withdrawal") return total - transaction.amount
		return total
	}, 0) : 0;

	const progressValue = Math.floor(currentAmount / goalAmount * 100)
	const isOrangeCard = [0, 5].includes(index)
	const status = progressValue === 100 ? "complete" : progressValue > 0 && progressValue < 100 && !isOrangeCard ? "progressed" : "default";

	return (
		<Card className={clsx({
			"md:col-span-2 bg-orange": isOrangeCard,
			"bg-zinc-800": !isOrangeCard,
			"lg:row-span-2": [1, 4].includes(index),
		})}>
			<CardHeader>{name}</CardHeader>

			<CardContent className="mt-auto">
				<span className={ clsx('text-4xl block mb-2', {
					"text-green-600": status === "complete",
					"text-orange": status === "progressed",
				})}>{progressValue}%</span>
				<Progress value={progressValue} status={status} />
			</CardContent>

			<CardFooter className='flex items-center gap-4 text-xs'>
				<p><span>${new Intl.NumberFormat().format(currentAmount)}</span> of <span>${new Intl.NumberFormat().format(goalAmount)}</span></p>
				<span>{deadline ? 'Due ' + Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(deadline)) : 'No deadline'}</span>
			</CardFooter>
		</Card>
	)
}

export default GoalCard
