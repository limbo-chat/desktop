import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "../../components/button";

export const Route = createFileRoute("/settings/developer")({
	component: DeveloperSettingsPage,
});

function DeveloperSettingsPage() {
	return (
		<div>
			<Link className={buttonVariants()} to="/design-playground">
				Open design playground
			</Link>
		</div>
	);
}
