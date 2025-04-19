import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Sidebar, SidebarGroup, SidebarItem } from "../../components/sidebar";
import { usePlugins } from "../../features/plugins/hooks";
import "./styles.scss";

export const Route = createFileRoute("/settings")({
	component: SettingsLayout,
});

const SettingsSidebar = () => {
	const plugins = usePlugins();
	const location = useLocation();

	return (
		<Sidebar className="settings-sidebar">
			<SidebarGroup title="Settings">
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
					<SidebarItem isActive={location.pathname.endsWith("/settings/development")}>
						Developer
					</SidebarItem>
				</Link>
				<Link to="/settings/plugins">
					<SidebarItem isActive={location.pathname.endsWith("/settings/plugins")}>
						Plugins
					</SidebarItem>
				</Link>
			</SidebarGroup>
			<SidebarGroup title="Plugins">
				{plugins.map((plugin) => (
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
			</SidebarGroup>
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
