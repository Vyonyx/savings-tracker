import { Plus } from "lucide-react"
const Header = () => {
	return (
		<header className="py-4 border-b">
			<div className="container mx-auto flex justify-between items-center">
				<h1 className="text-2xl">Savings Tracker</h1>
				<button className="text-black bg-orange hover:bg-white rounded-full flex items-center gap-1 ps-5 pe-6 py-2"><Plus /> New Goal</button>
			</div>
		</header>
	)
}

export default Header
