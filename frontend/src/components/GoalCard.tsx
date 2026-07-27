import { Progress } from "./ui/progress"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import type { Goal } from "#/types"

export const GoalCard = ({ goal }: {goal: Goal}) => {
	const { name, goalAmount, deadline } = goal
	// const progressValue = Math.floor(currentAmount / goalAmount * 100)
	const progressValue = 70

	return (
		<Card className='col-span-2 bg-orange'>
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
