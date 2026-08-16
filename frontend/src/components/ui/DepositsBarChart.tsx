import {  Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { ChartContainer, type ChartConfig } from '#/components/ui/chart'
import CustomTick from '#/components/CustomTick'
import type { Goal } from "#/types"

type Props = {
	goals: Goal[]
}

type ChartData = {
	month: string
	total: number
	totalLabel?: string
}

function DepositsBarChart({ goals }: Props) {
	const chartData: ChartData[] = [
		{ month: "Jan", total: 0 },
		{ month: "Feb", total: 0 },
		{ month: "Mar", total: 0 },
		{ month: "Apr", total: 0 },
		{ month: "May", total: 0 },
		{ month: "Jun", total: 0 },
		{ month: "Jul", total: 0 },
		{ month: "Aug", total: 0 },
		{ month: "Sep", total: 0 },
		{ month: "Oct", total: 0 },
		{ month: "Nov", total: 0 },
		{ month: "Dec", total: 0 },
	]

	goals.forEach((goal) => {
		goal.transactions?.forEach((transaction) => {
			const date = new Date(transaction.createdAt)
			const shortMonthName = date.toLocaleString('default', { month: 'short' });
			const existing = chartData.find(data => data.month === shortMonthName)
			if (existing) existing.total += transaction.type === "withdrawal" ? transaction.amount * -1 : transaction.amount
		})
	})

	chartData.forEach(map => map.totalLabel = `$${Intl.NumberFormat().format(map.total)}`)

	const chartsConfig = {} satisfies ChartConfig

	return (
		<ChartContainer config={chartsConfig} className='h-40 w-full'>
			<BarChart data={chartData}>
				<CartesianGrid vertical={false} />

				<XAxis
					dataKey="month"
					tickLine={false}
					axisLine={false}
					height={40}
					tick={(props) => <CustomTick {...props} data={chartData} />}
				/>

				<Bar dataKey="total" fill="var(--color-orange)" radius={8} />
			</BarChart>
		</ChartContainer>
	)
}

export default DepositsBarChart
