import GoalCard from '#/components/GoalCard'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpDown, ListFilter } from 'lucide-react'
import goalsData from "../data/goals.json"
import type { Goal } from '#/types'

export const Route = createFileRoute('/')({ 
	loader: (): Goal[] => {
		return goalsData as Goal[]
	},
	component: Home
})

function Home() {
	const goals = Route.useLoaderData()

	let totalSavings = 0;
	goals?.forEach((goal) => {
		if (!goal.transactions) return
		const subtotal = goal.transactions.reduce((subtotal, transaction) => {
			if (transaction.type === "withdrawal") return subtotal - transaction.amount
			return subtotal + transaction.amount
		}, 0)
		totalSavings += subtotal
	})

	return (
		<main className='container mx-auto px-8'>
			<section className='dashboard-statistics grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-10'>
				<Card className='md:col-span-2 bg-orange'>
					<CardHeader className='card-heading--small'>Total savings</CardHeader>
					<CardContent>
						<span className='stat-number'>${new Intl.NumberFormat().format(totalSavings)}</span>
					</CardContent>
				</Card>

				<Card className='bg-zinc-800'>
					<CardHeader className='card-heading--small'>Active goals</CardHeader>
					<CardContent>
						<span className='stat-number text-orange'>
							{goals.reduce((total, goal) => {
								if (goal.isComplete) return total
								return total += 1
							}, 0)}
						</span>
					</CardContent>
				</Card>

				<Card className='bg-zinc-800'>
					<CardHeader className='card-heading--small'>Goals completed</CardHeader>
					<CardContent>
						<span className='stat-number text-green'>
							{goals.reduce((total, goal) => {
								if (!goal.isComplete) return total
								return total += 1
							}, 0)}
						</span>
					</CardContent>
				</Card>

				<Card className='md:col-span-2 lg:col-span-4 bg-zinc-800'>
					<CardHeader className='card-heading--regular'>Monthly deposits</CardHeader>
					<CardContent>
						<span className='text-2xl'>Graph goes here</span>
					</CardContent>
				</Card>
			</section>

			<section className='dashboard-goals-header flex justify-between items-center'>
				<h3 className='text-3xl'>Your goals</h3>

				<div className='flex gap-4 items-center'>
					<Button variant='secondary' size='lg'><ListFilter /> Filters</Button>
					<Button variant='secondary' size='lg'><ArrowUpDown /> Sort by</Button>
				</div>
			</section>

			<section className='dashboard-goals grid md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-4 mt-4 gap-4 mb-10'>
				{goals && goals.map((goal, i) => (
					<GoalCard key={goal.id ?? i} index={i} goal={goal} />
				))}
			</section>
		</main>
	)
}
