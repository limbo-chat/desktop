import { MaximizeIcon, MinimizeIcon, PanelLeftIcon, PanelRightIcon, XIcon } from "lucide-react";
import { IconButton } from "../../../components/icon-button";
import { useMainRouterClient } from "../../../lib/trpc";
import { useWindowInfoContext } from "../../window-info/hooks";

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
			<div className="titlebar-section" data-section="start">
				<div className="titlebar-action-section">
					<IconButton action="toggle-primary-sidebar">
						<PanelLeftIcon />
					</IconButton>
				</div>
			</div>
			<div className="titlebar-section" data-section="center">
				{/* nothing for now */}
			</div>
			<div className="titlebar-section" data-section="end">
				<div className="titlebar-action-section">
					<IconButton action="toggle-secondary-sidebar">
						<PanelRightIcon />
					</IconButton>
				</div>
				{shouldRenderControls && <WindowControls />}
			</div>
		</div>
	);
};
