import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Anchor } from "../../components/anchor";
import { Button } from "../../components/button";
import {
	SettingItem,
	SettingItemControl,
	SettingItemDescription,
	SettingItemInfo,
	SettingItemTitle,
	SettingsSection,
	SettingsSectionActions,
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
				<form onSubmit={handleSubmit}>
					<SettingsSection>
						<SettingsSectionContent>
							<SettingItem data-setting="username">
								<SettingItemInfo>
									<SettingItemTitle>Username</SettingItemTitle>
									<SettingItemDescription>
										What would you like to be called?
									</SettingItemDescription>
								</SettingItemInfo>
								<SettingItemControl>
									<input
										type="text"
										placeholder="Enter your name"
										{...form.register("username")}
									/>
								</SettingItemControl>
							</SettingItem>
							<SettingItem data-setting="system-prompt">
								<SettingItemInfo>
									<SettingItemTitle>System prompt</SettingItemTitle>
									<SettingItemDescription>
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
									</SettingItemDescription>
								</SettingItemInfo>
								<SettingItemControl>
									<textarea {...form.register("systemPrompt")} />
								</SettingItemControl>
							</SettingItem>
							<SettingsSectionActions>
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
							</SettingsSectionActions>
						</SettingsSectionContent>
					</SettingsSection>
				</form>
			</SettingsPageContent>
		</SettingsPage>
	);
}
