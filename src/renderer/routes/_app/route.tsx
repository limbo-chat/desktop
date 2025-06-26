import { createFileRoute, Outlet } from "@tanstack/react-router";
import {
	useOpenCommandPaletteHotkey,
	useRegisterCoreCommands,
} from "../../features/commands/hooks";
import { usePluginHotReloader, usePluginLoader } from "../../features/plugins/hooks/core";
import { usePluginSyncLayer } from "../../features/plugins/hooks/use-plugin-sync-layer";
import { SideDock } from "./-components/side-dock";
import { Titlebar } from "./-components/titlebar";

export const Route = createFileRoute("/_app")({
	component: AppLayout,
});

function AppLayout() {
	usePluginSyncLayer();
	usePluginLoader();
	usePluginHotReloader();

	useRegisterCoreCommands();
	useOpenCommandPaletteHotkey();

	return (
		<>
			<Titlebar />
			<div className="app-content">
				<SideDock />
				<div className="root-page">
					<Outlet />
				</div>
			</div>
		</>
	);
}
