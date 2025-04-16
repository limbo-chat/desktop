import { createFileRoute, Link } from "@tanstack/react-router";
import { buttonVariants } from "../../components/button";
import { Field, FieldDescription, FieldLabel } from "../../components/field";
import { Checkbox } from "../../components/checkbox";
import { useState } from "react";

export const Route = createFileRoute("/settings/developer")({
	component: DeveloperSettingsPage,
});

function DeveloperSettingsPage() {
	const [isDevMode, setIsDevMode] = useState<boolean>(false);

	return (
		<div>
			<div className="card">
				<Field>
					<FieldLabel>Developer mode</FieldLabel>
					<FieldDescription>
						Developer mode activates the development server which enables hot reloading
						of plugins and custom styles.
					</FieldDescription>
					<Checkbox
						checked={isDevMode}
						onCheckedChange={(e) => setIsDevMode(e.checked as boolean)}
					/>
				</Field>
			</div>
			<Link className={buttonVariants()} to="/design-playground">
				Open design playground
			</Link>
		</div>
	);
}
