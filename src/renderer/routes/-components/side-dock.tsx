import { MessageSquareIcon, SettingsIcon, TerminalIcon } from "lucide-react";
import { Link } from "../../components/link";
import { Tooltip } from "../../components/tooltip";
import { showCommandPalette } from "../../features/commands/utils";

export const SideDock = () => {
	return (
		<div className="side-dock">
			<Tooltip label="Chat" contentProps={{ side: "right" }}>
				<Link to="/chat" className="side-dock-item" activeProps={{ "data-active": true }}>
					<MessageSquareIcon />
				</Link>
			</Tooltip>
			<Tooltip label="Settings" contentProps={{ side: "right" }}>
				<Link
					to="/settings"
					className="side-dock-item"
					activeProps={{ "data-active": true }}
				>
					<SettingsIcon />
				</Link>
			</Tooltip>
			<Tooltip label="Open command palette" contentProps={{ side: "right" }}>
				<button className="side-dock-item" onClick={showCommandPalette}>
					<TerminalIcon />
				</button>
			</Tooltip>
		</div>
	);
};
