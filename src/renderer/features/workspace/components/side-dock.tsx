import { SettingsIcon, TerminalIcon } from "lucide-react";
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
						<TerminalIcon />
					</IconButton>
				</Tooltip>
			</div>
			<div className="side-dock-section">
				<Tooltip label="Settings" contentProps={{ side: "right" }}>
					<IconButton action="open-settings" onClick={showSettingsModal}>
						<SettingsIcon />
					</IconButton>
				</Tooltip>
			</div>
		</div>
	);
};
