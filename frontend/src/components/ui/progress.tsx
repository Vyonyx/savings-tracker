import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "#/lib/utils.ts"

const progressColours = {
	default: {root: "bg-primary/20", indicator: "bg-primary"},
	progressed: {root: "bg-primary/20", indicator: "bg-orange"},
	complete: {root: "bg-primary/20", indicator: "bg-green-600"},
} as const

	type ProgressStatus = keyof typeof progressColours;

function Progress({
  className,
  value,
	color,
	status = "default",
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
		status?: ProgressStatus
	}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        `relative h-2 w-full overflow-hidden rounded-full ${progressColours[status].root}`,
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={`h-full w-full flex-1 ${progressColours[status].indicator} transition-all`}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
