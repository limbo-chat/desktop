import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../components/button";
import {
	SettingsSection,
	SettingsSectionContent,
	SettingsSectionHeader,
	SettingsSectionTitle,
} from "../../components/settings";
import { useDeleteAllChatsMutation } from "../../features/chat/hooks/queries";
import {
	SettingsPage,
	SettingsPageContent,
	SettingsPageDescription,
	SettingsPageHeader,
	SettingsPageTitle,
} from "./-components/settings-page";

export const Route = createFileRoute("/settings/data")({
	component: ChatSettingsPage,
});

function ChatSettingsPage() {
	const deleteAllChatsMutation = useDeleteAllChatsMutation();

	const handleDeleteAllChats = () => {
		deleteAllChatsMutation.mutate();
	};

	return (
		<SettingsPage data-page="data">
			<SettingsPageHeader>
				<SettingsPageTitle>Data management</SettingsPageTitle>
				<SettingsPageDescription>Manage your data</SettingsPageDescription>
			</SettingsPageHeader>
			<SettingsPageContent>
				<SettingsSection>
					<SettingsSectionContent>
						<Button data-action="delete-chats" onClick={handleDeleteAllChats}>
							Delete chats
						</Button>
					</SettingsSectionContent>
				</SettingsSection>
			</SettingsPageContent>
		</SettingsPage>
	);
}
