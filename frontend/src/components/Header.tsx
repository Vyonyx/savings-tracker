import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Link } from "@tanstack/react-router"
const Header = () => {
	return (
		<header className="py-4 border-b">
			<div className="container px-8 mx-auto flex justify-between items-center">
				<Link to="/goals">
					<h1 className="text-2xl">Savings Tracker</h1>
				</Link>

				<Button asChild variant="orange" size="lg">
					<Link to="/goals/new">
						<Plus /> New Goal
					</Link>
				</Button>
			</div>
		</header>
	)
}

export default Header
