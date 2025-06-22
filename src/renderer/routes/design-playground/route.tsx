import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
	Sidebar,
	SidebarSection,
	SidebarSectionHeader,
	SidebarSectionTitle,
	SidebarSectionContent,
	SidebarItem,
	SidebarLinkItem,
	SidebarItemLabel,
} from "../../components/sidebar";

export const Route = createFileRoute("/design-playground")({
	component: DesignPlaygroundLayout,
});

const DesignPlaygroundSidebar = () => {
	return (
		<Sidebar className="design-playground-sidebar">
			<SidebarSection>
				<SidebarSectionHeader>
					<SidebarSectionTitle>Elements</SidebarSectionTitle>
				</SidebarSectionHeader>
				<SidebarSectionContent>
					<SidebarLinkItem to="/design-playground/elements/button">
						<SidebarItemLabel>Button</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/design-playground/elements/tooltip">
						<SidebarItemLabel>Tooltip</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/design-playground/elements/form">
						<SidebarItemLabel>Form</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/design-playground/elements/dialog">
						<SidebarItemLabel>Dialog</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/design-playground/elements/markdown">
						<SidebarItemLabel>Markdown</SidebarItemLabel>
					</SidebarLinkItem>
					<SidebarLinkItem to="/design-playground/elements/llm-picker">
						<SidebarItemLabel>LLM picker</SidebarItemLabel>
					</SidebarLinkItem>
				</SidebarSectionContent>
			</SidebarSection>
		</Sidebar>
	);
};

function DesignPlaygroundLayout() {
	return (
		<div className="design-playground-page">
			<DesignPlaygroundSidebar />
			<div className="design-playground-content">
				<Outlet />
			</div>
		</div>
	);
}
