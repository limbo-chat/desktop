import type * as limbo from "@limbo/api";
import { useChatPanel } from "../hooks";

export interface ChatPanelRendererProps {
	chatPanelId: string;
	chatPanelData: limbo.JsonObject;
}

export const ChatPanelRenderer = ({ chatPanelId, chatPanelData }: ChatPanelRendererProps) => {
	const chatPanel = useChatPanel(chatPanelId);

	if (!chatPanel) {
		return null;
	}

	const Component = chatPanel.component;

	return <Component data={chatPanelData} />;
};
