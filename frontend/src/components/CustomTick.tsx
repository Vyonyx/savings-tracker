function CustomTick({ x, y, payload, data }: any) {
	const entry = data[payload.index]
	return (
		<g transform={`translate(${x},${y})`}>
			<text x={0} y={0} dy={12} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">
				{entry.totalLabel}
			</text>
			<text x={0} y={0} dy={28} textAnchor="middle" fontSize={12} fill="var(--foreground)">
				{entry.month}
			</text>
		</g>
	)
}
 export default CustomTick
