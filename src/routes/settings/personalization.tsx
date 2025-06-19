import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Anchor } from "../../components/anchor";
import { Button } from "../../components/button";
import { Field } from "../../components/field";
import * as FieldPrimitives from "../../components/field-primitives";
import {
	Form,
	FormActions,
	FormContent,
	FormFooter,
	FormSection,
	FormSectionContent,
} from "../../components/form";
import {
	SettingItem,
	SettingItemControl,
	SettingItemDescription,
	SettingItemInfo,
	SettingItemTitle,
	SettingsSection,
	SettingsSectionContent,
} from "../../components/settings";
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
				<Form onSubmit={handleSubmit}>
					<FormContent>
						<FormSection>
							<FormSectionContent>
								<Field
									id="username"
									label="Username"
									description="What would you like to be called?"
								>
									<FieldPrimitives.TextInput
										placeholder="Enter your name"
										{...form.register("username")}
									/>
								</Field>
								<Field
									id="system-prompt"
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
									<FieldPrimitives.Textarea {...form.register("systemPrompt")} />
								</Field>
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
			</SettingsPageContent>
		</SettingsPage>
	);
}
