import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { FieldDescription, FieldLabel, FieldRoot } from "../../components/field";
import { useUpdateSettingsMutation } from "../../features/settings/hooks";
import { useMainRouter } from "../../lib/trpc";
import { SettingsPage } from "./-components/settings-page";

export const Route = createFileRoute("/settings/personalization")({
	component: PersonalizationSettingsPage,
	wrapInSuspense: true,
});

function PersonalizationSettingsPage() {
	const mainRouter = useMainRouter();
	const getSettingsQuery = useSuspenseQuery(mainRouter.settings.get.queryOptions());
	const updateSettingsMutation = useUpdateSettingsMutation();
	const settings = getSettingsQuery.data;

	const form = useForm({
		values: {
			username: settings.username,
			systemPrompt: settings.systemPrompt,
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		updateSettingsMutation.mutate(data);
	});

	return (
		<SettingsPage className="personalization-settings-page">
			<form onSubmit={handleSubmit}>
				<FieldRoot>
					<FieldLabel>Username</FieldLabel>
					<FieldDescription>What would you like to be called?</FieldDescription>
					<input
						type="text"
						placeholder="Enter your name"
						{...form.register("username")}
					/>
				</FieldRoot>
				<FieldRoot>
					<FieldLabel>System prompt</FieldLabel>
					<FieldDescription>
						This prompt is used to set the context for all chat completions.{" "}
						<a href="https://ejs.co/" target="_blank" tabIndex={-1}>
							Learn about EJS
						</a>
					</FieldDescription>
					<textarea {...form.register("systemPrompt")} />
				</FieldRoot>
				<Button type="submit">Save preferences</Button>
			</form>
		</SettingsPage>
	);
}
