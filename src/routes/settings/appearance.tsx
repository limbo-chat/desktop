import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "../../components/button";
import { SettingsPage } from "./-components/settings-page";

export const Route = createFileRoute("/settings/appearance")({
	component: AppearanceSettingsPage,
});

function AppearanceSettingsPage() {
	return (
		<SettingsPage className="settings-page--appearance">
			<Link className={buttonVariants()} to="/design-playground">
				Open design playground
			</Link>
		</SettingsPage>
	);
}
