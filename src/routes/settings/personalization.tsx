import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Anchor } from "../../components/anchor";
import { Button } from "../../components/button";
import { FieldDescription, FieldLabel, FieldRoot } from "../../components/field";
import {
	SettingsActions,
	SettingsForm,
	SettingsSection,
	SettingsSectionContent,
} from "../../components/settings";
import { useUpdateSettingsMutation } from "../../features/settings/hooks";
import { useMainRouter } from "../../lib/trpc";
import {
	SettingsPage,
	SettingsPageContent,
	SettingsPageDescription,
	SettingsPageHeader,
	SettingsPageTitle,
} from "./-components/settings-page";

export const Route = createFileRoute("/settings/personalization")({
	component: PersonalizationSettingsPage,
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
		<SettingsPage data-page="personalization">
			<SettingsPageHeader>
				<SettingsPageTitle>Personalization</SettingsPageTitle>
				<SettingsPageDescription>Personalize your experience.</SettingsPageDescription>
			</SettingsPageHeader>
			<SettingsPageContent>
				<SettingsSection>
					<SettingsSectionContent>
						<SettingsForm onSubmit={handleSubmit}>
							<FieldRoot data-field="username">
								<FieldLabel>Username</FieldLabel>
								<FieldDescription>
									What would you like to be called?
								</FieldDescription>
								<input
									type="text"
									placeholder="Enter your name"
									{...form.register("username")}
								/>
							</FieldRoot>
							<FieldRoot data-field="system-prompt">
								<FieldLabel>System prompt</FieldLabel>
								<FieldDescription>
									This prompt is used to set the context for all chat completions.
									Learn about{" "}
									<Anchor
										href="https://handlebarsjs.com"
										target="_blank"
										tabIndex={-1}
									>
										Handlebars
									</Anchor>
									.
								</FieldDescription>
								<textarea {...form.register("systemPrompt")} />
							</FieldRoot>
							<SettingsActions>
								<Button
									data-action="cancel"
									disabled={!form.formState.isDirty}
									onClick={() => form.reset()}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									data-action="save"
									disabled={!form.formState.isDirty}
								>
									Save changes
								</Button>
							</SettingsActions>
						</SettingsForm>
					</SettingsSectionContent>
				</SettingsSection>
			</SettingsPageContent>
		</SettingsPage>
	);
}
