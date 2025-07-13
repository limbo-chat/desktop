import { AppIcon } from "../../../components/app-icon";
import { IconButton } from "../../../components/icon-button";
import { Tooltip } from "../../../components/tooltip";
import { showCommandPalette } from "../../commands/utils";
import { showSettingsModal } from "../../settings/utils";

export const SideDock = () => {
	return (
		<div className="side-dock">
			<div className="side-dock-section">
				<Tooltip label="Open command palette" contentProps={{ side: "right" }}>
					<IconButton action="open-command-palette" onClick={showCommandPalette}>
						<AppIcon icon="terminal" />
					</IconButton>
				</Tooltip>
			</div>
			<div className="side-dock-section">
				<Tooltip label="Settings" contentProps={{ side: "right" }}>
					<IconButton action="open-settings" onClick={showSettingsModal}>
						<AppIcon icon="settings" />
					</IconButton>
				</Tooltip>
			</div>
		</div>
	);
};
