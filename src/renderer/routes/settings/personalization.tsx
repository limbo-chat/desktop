import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { Anchor } from "../../components/anchor";
import { Button } from "../../components/button";
import * as FieldController from "../../components/field-controller";
import * as Form from "../../components/form-primitive";
import * as RhfForm from "../../components/rhf-form";
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
					<Form.Root onSubmit={handleSubmit}>
						<Form.Content>
							<Form.Section>
								<Form.SectionContent>
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
								</Form.SectionContent>
							</Form.Section>
						</Form.Content>
						<Form.Footer>
							<Form.Actions>
								<RhfForm.ResetButton>Cancel</RhfForm.ResetButton>
								<Form.SubmitButton>Save changes</Form.SubmitButton>
							</Form.Actions>
						</Form.Footer>
					</Form.Root>
				</FormProvider>
			</SettingsPageContent>
		</SettingsPage>
	);
}
