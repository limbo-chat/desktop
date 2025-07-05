import { SettingsIcon, TerminalIcon } from "lucide-react";
import { Tooltip } from "../../../components/tooltip";
import { showCommandPalette } from "../../commands/utils";

export const SideDock = () => {
	return (
		<div className="side-dock">
			<div className="side-dock-section">
				<Tooltip label="Open command palette" contentProps={{ side: "right" }}>
					<button className="side-dock-item" onClick={showCommandPalette}>
						<TerminalIcon />
					</button>
				</Tooltip>
			</div>
			<div className="side-dock-section">
				<Tooltip label="Settings" contentProps={{ side: "right" }}>
					<button className="side-dock-item">
						<SettingsIcon />
					</button>
				</Tooltip>
			</div>
		</div>
	);
};
