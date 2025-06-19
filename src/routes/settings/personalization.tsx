import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { Anchor } from "../../components/anchor";
import { Button } from "../../components/button";
import * as FieldController from "../../components/field-controller";
import {
	Form,
	FormActions,
	FormContent,
	FormFooter,
	FormSection,
	FormSectionContent,
} from "../../components/form";
import {
	useGetSettingsSuspenseQuery,
	useUpdateSettingsMutation,
} from "../../features/settings/hooks";
import { SettingsPage, SettingsPageContent } from "./-components/settings-page";

export const Route = createFileRoute("/settings/personalization")({
	component: PersonalizationSettingsPage,
});

function PersonalizationSettingsPage() {
	const getSettingsQuery = useGetSettingsSuspenseQuery();
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
			<SettingsPageContent>
				<FormProvider {...form}>
					<Form onSubmit={handleSubmit}>
						<FormContent>
							<FormSection>
								<FormSectionContent>
									<FieldController.Root
										id="username"
										name="username"
										label="Username"
										description="What would you like to be called?"
									>
										<FieldController.TextInput placeholder="Enter your name" />
									</FieldController.Root>
									<FieldController.Root
										id="system-prompt"
										name="systemPrompt"
										label="System prompt"
										description={
											<>
												This prompt is used to set the context for all chat
												completions. Learn about{" "}
												<Anchor
													href="https://handlebarsjs.com"
													target="_blank"
													tabIndex={-1}
												>
													Handlebars
												</Anchor>
												.
											</>
										}
									>
										<FieldController.Textarea />
									</FieldController.Root>
								</FormSectionContent>
							</FormSection>
						</FormContent>
						<FormFooter>
							<FormActions>
								<Button
									type="button"
									data-action="cancel"
									disabled={!form.formState.isDirty}
									onClick={() => form.reset()}
								>
									Cancel
								</Button>
								<Button
									type="submit"
									data-action="submit"
									disabled={!form.formState.isDirty}
								>
									Save changes
								</Button>
							</FormActions>
						</FormFooter>
					</Form>
				</FormProvider>
			</SettingsPageContent>
		</SettingsPage>
	);
}
