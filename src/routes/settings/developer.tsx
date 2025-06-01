import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/card";
import { Checkbox } from "../../components/checkbox";
import { SettingsPage } from "./-components/settings-page";

export const Route = createFileRoute("/settings/developer")({
	component: DeveloperSettingsPage,
});

function DeveloperSettingsPage() {
	const [isDevMode, setIsDevMode] = useState<boolean>(false);

	return (
		<SettingsPage className="developer-settings-page">
			<Card>
				<CardHeader>
					<CardTitle>Developer mode</CardTitle>
					<CardDescription>
						Developer mode enables hot reloading of plugins and custom styles
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Checkbox
						checked={isDevMode}
						onCheckedChange={(isChecked) => setIsDevMode(isChecked as boolean)}
					/>
				</CardContent>
			</Card>
		</SettingsPage>
	);
}
