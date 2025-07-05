import { HammerIcon, InfoIcon } from "lucide-react";
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
import { useEnabledToolIds } from "../../../features/storage/hooks";
import { setEnabledToolIds } from "../../../features/storage/utils";
import { useToolList } from "../../../features/tools/hooks";

export const ChatToolsMenu = () => {
	const tools = useToolList();
	const enabledToolIds = useEnabledToolIds();

	return (
		<MenuRoot>
			<MenuTrigger asChild>
				<IconButton>
					<HammerIcon />
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
										<InfoIcon />
									</Tooltip>
								</div>
								<Switch
									checked={enabledToolIds.includes(tool.id)}
									onCheckedChange={(isChecked) => {
										if (isChecked) {
											setEnabledToolIds([...enabledToolIds, tool.id]);
										} else {
											const newEnabledToolIds = enabledToolIds.filter(
												(enabledToolid) => enabledToolid !== tool.id
											);

											setEnabledToolIds(newEnabledToolIds);
										}
									}}
								/>
							</MenuItem>
						))}
					</MenuSectionContent>
				</MenuSection>
			</MenuContent>
		</MenuRoot>
	);
};
