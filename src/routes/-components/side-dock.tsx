import { Link } from "@tanstack/react-router";
import { MessageSquareIcon, SettingsIcon, TerminalIcon } from "lucide-react";
import { Tooltip } from "../../components/tooltip";
import { setIsCommandPaletteOpen } from "../../features/commands/utils";

export const SideDock = () => {
	return (
		<div className="side-dock">
			<Tooltip label="Chat" positioning={{ placement: "right" }}>
				<Link to="/chat" className="side-dock-item">
					<MessageSquareIcon />
				</Link>
			</Tooltip>
			<Tooltip label="Settings" positioning={{ placement: "right" }}>
				<Link to="/settings" className="side-dock-item">
					<SettingsIcon />
				</Link>
			</Tooltip>
			<Tooltip label="Open command palette" positioning={{ placement: "right" }}>
				<button className="side-dock-item" onClick={() => setIsCommandPaletteOpen(true)}>
					<TerminalIcon />
				</button>
			</Tooltip>
		</div>
	);
};
