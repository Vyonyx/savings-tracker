import { Progress } from "./ui/progress"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import type { Goal } from "#/types"

export const GoalCard = ({ index, goal }: { index: number, goal: Goal }) => {
	const { name, goalAmount, deadline } = goal
	// const progressValue = Math.floor(currentAmount / goalAmount * 100)
	const progressValue = 70

	let cardClass;
	if ([0, 5].includes(index)) {
		cardClass = 'md:col-span-2'
	} else if ([1, 4].includes(index)) {
		cardClass = 'lg:row-span-2'
	}
	cardClass += [0, 5].includes(index) ? '  bg-orange' : ' bg-zinc-800'

	return (
		<Card className={cardClass}>
			<CardHeader>{name}</CardHeader>

			<CardContent>
				<span className='text-4xl'>{progressValue}%</span>
				<Progress value={progressValue}/>
			</CardContent>

			<CardFooter className='flex items-center gap-4 text-xs'>
				<p><span>CurrentAmount</span> of <span>${goalAmount}</span></p>
				<span>{deadline ? 'Due ' + deadline : 'No deadline'}</span>
			</CardFooter>
		</Card>
	)
}

export default GoalCard
