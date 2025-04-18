import { createFileRoute } from "@tanstack/react-router";
import { Checkbox } from "../../components/checkbox";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/card";
import { SettingsPage } from "./-components/settings-page";

export const Route = createFileRoute("/settings/developer")({
	component: DeveloperSettingsPage,
});

function DeveloperSettingsPage() {
	const [isDevMode, setIsDevMode] = useState<boolean>(false);

	return (
		<SettingsPage className="settings-page--developer">
			<Card>
				<CardHeader>
					<CardTitle>Developer mode</CardTitle>
					<CardDescription>
						Developer mode activates the development server which enables hot reloading
						of plugins and custom styles
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Checkbox
						checked={isDevMode}
						onCheckedChange={(e) => setIsDevMode(e.checked as boolean)}
					/>
				</CardContent>
			</Card>
		</SettingsPage>
	);
}
