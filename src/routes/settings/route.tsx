import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import {
	Sidebar,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupTitle,
	SidebarItem,
} from "../../components/sidebar";
import { usePluginStore } from "../../features/plugins/stores";

export const Route = createFileRoute("/settings")({
	component: SettingsLayout,
});

const SettingsSidebar = () => {
	const location = useLocation();
	const plugins = usePluginStore((state) => state.plugins);
	const enabledPlugins = Object.values(plugins).filter((plugin) => plugin.enabled);

	return (
		<Sidebar className="settings-sidebar">
			<SidebarGroup>
				<SidebarGroupTitle>Settings</SidebarGroupTitle>
				<SidebarGroupContent>
					<Link to="/settings">
						<SidebarItem isActive={location.pathname.endsWith("/settings")}>
							General
						</SidebarItem>
					</Link>
					<Link to="/settings/appearance">
						<SidebarItem isActive={location.pathname.endsWith("/appearance")}>
							Appearance
						</SidebarItem>
					</Link>
					<Link to="/settings/developer">
						<SidebarItem isActive={location.pathname.endsWith("/settings/developer")}>
							Developer
						</SidebarItem>
					</Link>
					<Link to="/settings/plugins">
						<SidebarItem isActive={location.pathname.endsWith("/settings/plugins")}>
							Plugins
						</SidebarItem>
					</Link>
				</SidebarGroupContent>
			</SidebarGroup>
			{enabledPlugins.length > 0 && (
				<SidebarGroup>
					<SidebarGroupTitle>Plugins</SidebarGroupTitle>
					<SidebarGroupContent>
						{enabledPlugins.map((plugin) => (
							<Link
								to="/settings/plugins/$id"
								params={{ id: plugin.manifest.id }}
								key={plugin.manifest.id}
							>
								<SidebarItem
									isActive={location.pathname.endsWith(
										`/settings/plugins/${plugin.manifest.id}`
									)}
								>
									{plugin.manifest.name}
								</SidebarItem>
							</Link>
						))}
					</SidebarGroupContent>
				</SidebarGroup>
			)}
		</Sidebar>
	);
};

function SettingsLayout() {
	return (
		<div className="settings-layout">
			<SettingsSidebar />
			<Outlet />
		</div>
	);
}
