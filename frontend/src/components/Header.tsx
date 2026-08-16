import { Plus } from "lucide-react"
import { Button } from "./ui/button"
import { Link, useNavigate } from "@tanstack/react-router"
import { authClient } from "#/lib/auth-client"
const Header = () => {
	const { data: session } = authClient.useSession()
	const navigate = useNavigate()

	const handleSignOut = async () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					navigate({to: "/login"})
				},
			},
		})
	}
	return (
		<header className="py-4 border-b">
			<div className="container px-8 mx-auto flex justify-between items-center">
				<Link to="/goals">
					<h1 className="text-2xl">Savings Tracker</h1>
				</Link>

				<div className="flex items-center gap-x-2">
					{session ? (
						<>
							<Button asChild variant="orange" size="lg">
								<Link to="/goals/new">
									<Plus /> New Goal
								</Link>
							</Button>

							<Button variant="orange" size="lg" onClick={handleSignOut}>Sign Out</Button>
						</>
					) : (
							<Button asChild variant="orange" size="lg">
								<Link to="/login">Login</Link>
							</Button>
						)}
				</div>
			</div>
		</header>
	)
}

export default Header
