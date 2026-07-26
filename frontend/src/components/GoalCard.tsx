import { Progress } from "./ui/progress"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"

type Props = {
	name: string
	currentAmount: number
	goalAmount: number
	deadline?: string
}

export const GoalCard = ({
	name,
	currentAmount, 
	goalAmount, 
	deadline,
}: Props) => {
	const progressValue = Math.floor(currentAmount / goalAmount * 100)

	return (
		<Card className='col-span-2 bg-orange'>
			<CardHeader>{name}</CardHeader>

			<CardContent>
				<span className='text-4xl'>{progressValue}%</span>
				<Progress value={progressValue}/>
			</CardContent>

			<CardFooter className='flex items-center gap-4 text-xs'>
				<p><span>${currentAmount}</span> of <span>${goalAmount}</span></p>
				<span>{deadline ? 'Due ' + deadline : 'No deadline'}</span>
			</CardFooter>
		</Card>
	)
}

export default GoalCard
