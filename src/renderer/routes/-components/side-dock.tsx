import { Link } from "@tanstack/react-router";
import { MessageSquareIcon, SettingsIcon, TerminalIcon } from "lucide-react";
import { Tooltip } from "../../components/tooltip";
import { showCommandPalette } from "../../features/commands/utils";

export const SideDock = () => {
	return (
		<div className="side-dock">
			<Tooltip label="Chat" contentProps={{ side: "right" }}>
				<Link to="/chat" className="side-dock-item">
					<MessageSquareIcon />
				</Link>
			</Tooltip>
			<Tooltip label="Settings" contentProps={{ side: "right" }}>
				<Link to="/settings" className="side-dock-item">
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
