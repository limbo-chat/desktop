import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Suspense } from "react";
import { Loading } from "../../../components/loading";
import {
	Sidebar,
	SidebarSection,
	SidebarSectionHeader,
	SidebarSectionTitle,
	SidebarSectionContent,
	SidebarLinkItem,
	SidebarItemLabel,
} from "../../../components/sidebar";
import { usePluginList } from "../../../features/plugins/hooks/core";

export const Route = createFileRoute("/_app/settings")({
	component: SettingsLayout,
});

const SettingsSidebar = () => {
	const pluginList = usePluginList();
	const enabledPlugins = pluginList.filter((plugin) => plugin.enabled);

	return (
		<Sidebar className="settings-sidebar">
			<SidebarSection>
				<SidebarSectionHeader>
					<SidebarSectionTitle>Settings</SidebarSectionTitle>
				</SidebarSectionHeader>
				<SidebarSectionContent>
					<SidebarLinkItem to="/settings" activeOptions={{ exact: true }}>
						<SidebarItemLabel>General</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/settings/personalization" activeOptions={{ exact: true }}>
						<SidebarItemLabel>Personalization</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/settings/data" activeOptions={{ exact: true }}>
						<SidebarItemLabel>Data</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/settings/appearance" activeOptions={{ exact: true }}>
						<SidebarItemLabel>Appearance</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/settings/developer" activeOptions={{ exact: true }}>
						<SidebarItemLabel>Developer</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/settings/plugins" activeOptions={{ exact: true }}>
						<SidebarItemLabel>Plugins</SidebarItemLabel>
					</SidebarLinkItem>
				</SidebarSectionContent>
			</SidebarSection>
			{enabledPlugins.length > 0 && (
				<SidebarSection>
					<SidebarSectionHeader>
						<SidebarSectionTitle>Plugins</SidebarSectionTitle>
					</SidebarSectionHeader>
					<SidebarSectionContent>
						{enabledPlugins.map((plugin) => (
							<SidebarLinkItem
								to="/settings/plugins/$id"
								params={{ id: plugin.manifest.id }}
								key={plugin.manifest.id}
							>
								<SidebarItemLabel>{plugin.manifest.name}</SidebarItemLabel>
							</SidebarLinkItem>
						))}
					</SidebarSectionContent>
				</SidebarSection>
			)}
		</Sidebar>
	);
};

function SettingsLayout() {
	return (
		<div className="settings-layout">
			<SettingsSidebar />
			<Suspense fallback={<Loading />}>
				<Outlet />
			</Suspense>
		</div>
	);
}
