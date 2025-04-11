import { createFileRoute, useRouter } from "@tanstack/react-router";
import { Button } from "../components/button";

export const Route = createFileRoute("/settings")({
	component: SettingsPage,
});

function SettingsPage() {
	const router = useRouter();

	return (
		<div>
			Settings
			<Button onClick={() => router.history.back()}>Go back</Button>
		</div>
	);
}
