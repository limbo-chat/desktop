import { HammerIcon, InfoIcon } from "lucide-react";
import { IconButton } from "../../../components/icon-button";
import {
	MenuRoot,
	MenuTrigger,
	MenuPositioner,
	MenuContent,
	MenuItem,
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
				<IconButton variant="ghost" color="secondary">
					<HammerIcon />
				</IconButton>
			</MenuTrigger>
			<MenuPositioner>
				<MenuContent>
					{tools.map((tool) => (
						<MenuItem value={tool.id} key={tool.id}>
							<div>
								<span>{tool.id}</span>
								<Tooltip
									label={tool.description}
									positioning={{ placement: "top" }}
								>
									<InfoIcon />
								</Tooltip>
							</div>
							<Switch
								checked={enabledToolIds.includes(tool.id)}
								onCheckedChange={({ checked }) => {
									if (checked) {
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
				</MenuContent>
			</MenuPositioner>
		</MenuRoot>
	);
};
