import { Link } from "@tanstack/react-router";
import { MessageSquareIcon, SettingsIcon } from "lucide-react";
import { Tooltip } from "../../components/tooltip";

export const SideDock = () => {
	return (
		<div className="side-dock">
			<Tooltip label="Chat" positioning={{ placement: "right" }}>
				<Link to="/chat" className="side-dock-item">
					<MessageSquareIcon size={20} />
				</Link>
			</Tooltip>
			<Tooltip label="Settings" positioning={{ placement: "right" }}>
				<Link to="/settings" className="side-dock-item">
					<SettingsIcon size={20} />
				</Link>
			</Tooltip>
		</div>
	);
};
