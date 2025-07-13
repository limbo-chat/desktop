import { AppIcon } from "../../../components/app-icon";
import { IconButton } from "../../../components/icon-button";
import {
	MenuRoot,
	MenuTrigger,
	MenuContent,
	MenuItem,
	MenuSection,
	MenuSectionContent,
} from "../../../components/menu";
import { Switch } from "../../../components/switch";
import { Tooltip } from "../../../components/tooltip";
import { useToolList } from "../../tools/hooks";

export interface ChatToolsMenuProps {
	enabledToolIds: string[];
	onEnabledToolIdsChange: (ids: string[]) => void;
}

export const ChatToolsMenu = ({ enabledToolIds, onEnabledToolIdsChange }: ChatToolsMenuProps) => {
	const tools = useToolList();

	const toggleToolEnabled = (toolId: string) => {
		let newEnabledToolIds = [...enabledToolIds];

		if (enabledToolIds.includes(toolId)) {
			newEnabledToolIds = enabledToolIds.filter((id) => id !== toolId);
		} else {
			newEnabledToolIds.push(toolId);
		}

		onEnabledToolIdsChange(newEnabledToolIds);
	};

	return (
		<MenuRoot>
			<MenuTrigger asChild>
				<IconButton>
					<AppIcon icon="hammer" />
				</IconButton>
			</MenuTrigger>
			<MenuContent>
				<MenuSection>
					<MenuSectionContent>
						{tools.map((tool) => (
							<MenuItem key={tool.id}>
								<div>
									<span>{tool.id}</span>
									<Tooltip
										label={tool.description}
										contentProps={{ side: "top" }}
									>
										<AppIcon icon="info" />
									</Tooltip>
								</div>
								<Switch
									checked={enabledToolIds.includes(tool.id)}
									onCheckedChange={() => toggleToolEnabled(tool.id)}
								/>
							</MenuItem>
						))}
					</MenuSectionContent>
				</MenuSection>
			</MenuContent>
		</MenuRoot>
	);
};
