import { MaximizeIcon, MinimizeIcon, PanelLeftIcon, PanelRightIcon, XIcon } from "lucide-react";
import { IconButton } from "../../../components/icon-button";
import { useWindowInfoContext } from "../../../features/window-info/hooks";
import { useMainRouterClient } from "../../../lib/trpc";

const WindowControls = () => {
	const mainRouter = useMainRouterClient();

	return (
		<div className="window-controls">
			<IconButton action="minimize" onClick={() => mainRouter.window.minimize.mutate()}>
				<MinimizeIcon />
			</IconButton>
			<IconButton action="maximize" onClick={() => mainRouter.window.maximize.mutate()}>
				<MaximizeIcon />
			</IconButton>
			<IconButton action="close" onClick={() => mainRouter.window.close.mutate()}>
				<XIcon />
			</IconButton>
		</div>
	);
};

export const Titlebar = () => {
	const windowInfo = useWindowInfoContext();
	const shouldRenderControls = windowInfo.platform !== "macos";

	return (
		<div className="titlebar">
			<div className="titlebar-actions">
				<div className="titlebar-action-section">
					<IconButton>
						<PanelLeftIcon />
					</IconButton>
				</div>
				<div className="titlebar-action-section">
					<IconButton>
						<PanelRightIcon />
					</IconButton>
				</div>
			</div>
			{shouldRenderControls && <WindowControls />}
		</div>
	);
};
