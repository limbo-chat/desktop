import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../components/button";
import {
	SettingItem,
	SettingItemControl,
	SettingItemDescription,
	SettingItemInfo,
	SettingItemTitle,
	SettingsSection,
	SettingsSectionContent,
} from "../../components/settings";
import { useDeleteAllChatsMutation } from "../../features/chat/hooks/queries";
import { SettingsPage, SettingsPageContent } from "./-components/settings-page";

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
			<SettingsPageContent>
				<SettingsSection>
					<SettingsSectionContent>
						<SettingItem data-setting="delete-chats">
							<SettingItemInfo>
								<SettingItemTitle>Delete chats</SettingItemTitle>
								<SettingItemDescription>
									Delete all chats. This action cannot be undone.
								</SettingItemDescription>
							</SettingItemInfo>
							<SettingItemControl>
								<Button data-action="delete-chats" onClick={handleDeleteAllChats}>
									Delete chats
								</Button>
							</SettingItemControl>
						</SettingItem>
					</SettingsSectionContent>
				</SettingsSection>
			</SettingsPageContent>
		</SettingsPage>
	);
}
