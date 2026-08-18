import type { Goal } from "#/types";
import { queryOptions } from "@tanstack/react-query";

export const goalsQueryOptions = queryOptions({
	queryKey: ["goals"],
	queryFn: async (): Promise<Goal[]> => {
		const res = await fetch(import.meta.env.VITE_SERVER + "/goals", {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("bearer-token")}`,
			}
		})
		if (!res.ok) throw new Error(`Failed to fetch goals: ${res.status}`)
		return res.json()
	},
})

export const singleGoalQueryOptions = (goalID: number) => queryOptions({
	queryKey: ["goals", goalID],
	queryFn: async (): Promise<Goal> => {
		const res = await fetch(import.meta.env.VITE_SERVER + `/goals/${goalID}`, {
			headers: {
				Authorization: `Bearer ${localStorage.getItem("bearer-token")}`,
			},
		})
		if (!res.ok) throw new Error(`Faild to fetch goal id ${goalID}: ${res.status}`)
		return res.json()
	},
})
