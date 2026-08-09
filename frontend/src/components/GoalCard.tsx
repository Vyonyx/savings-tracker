import { Progress } from "./ui/progress"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import type { Goal } from "#/types"
import clsx from "clsx"
import { Dot, SquarePen } from "lucide-react"
import { Badge } from "./ui/badge"
import { Link } from "@tanstack/react-router"

export const GoalCard = ({ index, goal }: { index: number, goal: Goal }) => {
	const { id, name, goalAmount, deadline, isComplete, transactions } = goal

	const currentAmount = transactions ? transactions.reduce((total, transaction) => {
		if (transaction.type === "deposit") return total + transaction.amount
			else if (transaction.type === "withdrawal") return total - transaction.amount
		return total
	}, 0) : 0;

	const progressValue = Math.floor(currentAmount / goalAmount * 100)
	const isOrangeCard = [0, 5].includes(index)

	const status = isComplete ? "complete" : progressValue > 0 && progressValue < 100 && !isOrangeCard ? "progressed" : "default";

	return (
		<Card className={clsx({
			"md:col-span-2 bg-linear-to-r from-dark-orange to-orange": isOrangeCard,
			"bg-charcoal": !isOrangeCard,
			"lg:row-span-2": [1, 4].includes(index),
		})}>
			<CardHeader className="card-heading--regular flex justify-between align-center">
				<span>{name}</span>
				{isComplete && <Badge className="border-green text-green bg-green/10">Complete</Badge>}
			</CardHeader>

			<CardContent className="mt-auto">
				<span className={ clsx('stat-number block mb-2', {
					"text-green": status === "complete",
					"text-orange": status === "progressed",
				})}>{progressValue}%</span>
				<Progress value={progressValue} status={status} />
			</CardContent>

			<CardFooter className='flex items-center card-heading--small'>
				<p><span>${new Intl.NumberFormat().format(currentAmount)}</span> of <span>${new Intl.NumberFormat().format(goalAmount)}</span></p>
				<Dot className="text-primary/50" />
				<span className="text-primary/50">{deadline ? 'Due ' + Intl.DateTimeFormat('en-GB', {day: 'numeric', month: 'short', year: 'numeric'}).format(new Date(deadline)) : 'No deadline'}</span>

				<Link to="/edit/$goalID" params={{goalID: id.toString()}} className="ms-auto"><SquarePen className="size-4 text-primary/50 hover:text-primary transition-colors" /></Link>
			</CardFooter>
		</Card>
	)
}

export default GoalCard
