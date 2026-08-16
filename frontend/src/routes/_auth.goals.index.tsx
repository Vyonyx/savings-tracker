import GoalCard from '#/components/GoalCard'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardHeader } from '#/components/ui/card'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { ArrowUpDown, ListFilter } from 'lucide-react'
import goalsData from "../data/goals.json"
import type { Goal } from '#/types'
import DepositsBarChart from '#/components/ui/DepositsBarChart'
import { useState } from 'react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '#/components/ui/dropdown-menu'
import { authClient } from '#/lib/auth-client'
import { useQuery } from '@tanstack/react-query'

export const Route = createFileRoute('/_auth/goals/')({ 
	beforeLoad: async () => {
		const { data: session } = await authClient.getSession()
		if (!session) throw redirect(({ to: "/signup" }))
		return { session }
	},
	loader: (): Goal[] => {
		return goalsData as Goal[]
	},
	component: Goals
})

function Goals() {
	const goals = Route.useLoaderData()

	const { data } = useQuery({
		queryKey: ["goals"],
		queryFn: async () => {
			const url = import.meta.env.VITE_SERVER + "/me"
			const res = await fetch(url, {
				headers: {
					Authorization: `Bearer ${localStorage.getItem("bearer-token")}`,
				},
			})
			if (!res.ok) throw new Error(`Request failed: ${res.status}`)
			return res.json()
		},
	})

	console.log("me", data)

	const [visibleGoals, setVisibleGoals] = useState<Goal[]>(goals)

	let totalSavings = 0;
	goals.forEach((goal) => {
		if (!goal.transactions) return
		const subtotal = goal.transactions.reduce((subtotal, transaction) => {
			if (transaction.type === "withdrawal") return subtotal - transaction.amount
			return subtotal + transaction.amount
		}, 0)
		totalSavings += subtotal
	})

	const calculateGoalTotalDeposits = (goal: Goal) => {
		const total = goal.transactions?.reduce((sum, t) => {
			if (t.type === "withdrawal") return sum -= t.amount
			return sum += t.amount
		}, 0)
		return total ?? 0
	}

	const filterGoals = (status: "all" | "no-progress" | "in-progress" | "complete") => {
		switch (status) {
			case "all":
				setVisibleGoals(goals)
				break;
			case "no-progress":
				const unprogressedGoals = goals.filter(goal => calculateGoalTotalDeposits(goal) === 0)
				setVisibleGoals(unprogressedGoals)
				break;
			case "in-progress":
				const progressedGoals = goals.filter(goal => calculateGoalTotalDeposits(goal) > 0 && !goal.isComplete)
				setVisibleGoals(progressedGoals)
				break;
			case "complete": 
				const completeGoals = goals.filter(goal => goal.isComplete)
				setVisibleGoals(completeGoals)
				break;
		}
	}

	const sortGoals = (type: "date-asc" | "date-desc" | "deadline" | "progress" | "amount-saved" | "name-asc" | "name-desc") => {
		switch (type) {
			case "date-asc":
				const dateAscSort = [...visibleGoals].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
				setVisibleGoals(dateAscSort)
				break;
			case "date-desc":
				const dateDescSort = [...visibleGoals].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
				setVisibleGoals(dateDescSort)
				break;
			case "deadline":
				const deadlineSort = [...visibleGoals].sort((a, b) => {
					if (!a.deadline) return 1
					if (!b.deadline) return -1
					return new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
				})
				setVisibleGoals(deadlineSort)
				break;
			case "progress":
				const progressSort = [...visibleGoals].sort((a, b) => (calculateGoalTotalDeposits(b) / b.goalAmount ) - (calculateGoalTotalDeposits(a) / a.goalAmount))
				setVisibleGoals(progressSort)
				break;
			case "amount-saved":
				const amountSavedSort = [...visibleGoals].sort((a, b) => calculateGoalTotalDeposits(b) - calculateGoalTotalDeposits(a))
				setVisibleGoals(amountSavedSort)
				break;
			case "name-asc":
				const nameAscSort = [...visibleGoals].sort((a, b) => a.name[0].toLowerCase().charCodeAt(0) - b.name[0].toLowerCase().charCodeAt(0))
				setVisibleGoals(nameAscSort)
				break;
			case "name-desc":
				const nameDescSort = [...visibleGoals].sort((a, b) => b.name[0].toLowerCase().charCodeAt(0) - a.name[0].toLowerCase().charCodeAt(0))
				setVisibleGoals(nameDescSort)
				break;
		}
	}

	return (
		<main className='container mx-auto px-8'>
			<section className='dashboard-statistics grid gap-4 md:grid-cols-2 lg:grid-cols-4 my-10'>
				<Card className='md:col-span-2 bg-linear-to-r from-dark-orange to-orange'>
					<CardHeader className='card-heading--small'>Total savings</CardHeader>
					<CardContent>
						<span className='stat-number'>${new Intl.NumberFormat().format(totalSavings)}</span>
					</CardContent>
				</Card>

				<Card className='bg-charcoal'>
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

				<Card className='bg-charcoal'>
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

				<Card className='md:col-span-2 lg:col-span-4 bg-charcoal'>
					<CardHeader className='card-heading--regular'>Monthly deposits</CardHeader>
					<CardContent>
						<DepositsBarChart goals={goals} />
					</CardContent>
				</Card>
			</section>

			<section className='dashboard-goals-header flex justify-between items-center'>
				<h3 className='text-3xl'>Your goals</h3>

				<div className='flex gap-4 items-center'>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='secondary' size='lg'><ListFilter /> Filters</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => filterGoals("all")}>Show All</DropdownMenuItem>
								<DropdownMenuItem onClick={() => filterGoals("no-progress")}>No Progress</DropdownMenuItem>
								<DropdownMenuItem onClick={() => filterGoals("in-progress")}>In Progressed</DropdownMenuItem>
								<DropdownMenuItem onClick={() => filterGoals("complete")}>Complete</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>

					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='secondary' size='lg'><ArrowUpDown /> Sort by</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuGroup>
								<DropdownMenuItem onClick={() => sortGoals("date-asc")}>Date (ASC)</DropdownMenuItem>
								<DropdownMenuItem onClick={() => sortGoals("date-desc")}>Date (DESC)</DropdownMenuItem>
								<DropdownMenuItem onClick={() => sortGoals("name-asc")}>Name (ASC)</DropdownMenuItem>
								<DropdownMenuItem onClick={() => sortGoals("name-desc")}>Name (DESC)</DropdownMenuItem>
								<DropdownMenuItem onClick={() => sortGoals("deadline")}>Deadline</DropdownMenuItem>
								<DropdownMenuItem onClick={() => sortGoals("amount-saved")}>Amount Saved</DropdownMenuItem>
								<DropdownMenuItem onClick={() => sortGoals("progress")}>Progress</DropdownMenuItem>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
			</section>

			<section className='dashboard-goals grid md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-4 mt-4 gap-4 mb-10'>
				{visibleGoals && visibleGoals.map((goal, i) => (
					<GoalCard key={goal.id ?? i} index={i} goal={goal} />
				))}
			</section>
		</main>
	)
}
