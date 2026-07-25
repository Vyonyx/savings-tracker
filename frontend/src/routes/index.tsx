import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '#/components/ui/card'
import { Progress } from '#/components/ui/progress'
import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpDown, ListFilter } from 'lucide-react'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
	return (
		<main className='container mx-auto'>
			<section className='dashboard-statistics grid gap-4 grid-cols-4 my-10'>
				<Card className='col-span-2 bg-orange'>
					<CardHeader>Total savings</CardHeader>
					<CardContent>
						<span className='text-4xl'>$11,249.00</span>
					</CardContent>
				</Card>

				<Card className='bg-zinc-800'>
					<CardHeader>Active goals</CardHeader>
					<CardContent>
						<span className='text-4xl'>7</span>
					</CardContent>
				</Card>

				<Card className='bg-zinc-800'>
					<CardHeader>Goals completed</CardHeader>
					<CardContent>
						<span className='text-4xl'>2</span>
					</CardContent>
				</Card>

				<Card className='col-span-4 bg-zinc-800'>
					<CardHeader>Monthly deposits</CardHeader>
					<CardContent>
						<span className='text-4xl'>Graph goes here</span>
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

			<section className='dashboard-goals grid grid-cols-3 mt-4'>
				{/* Loop through data here to populate goals */}
				<Card className='col-span-2 bg-orange'>
					<CardHeader>Macbook Pro M4</CardHeader>

					<CardContent>
						<span className='text-4xl'>76%</span>
						<Progress value={60}/>
					</CardContent>

					<CardFooter className='flex items-center gap-4 text-xs'>
						<p><span>$4,000</span> of <span>$5,000</span></p>
						<span>No deadline</span>
					</CardFooter>
				</Card>
			</section>
		</main>
	)
}
