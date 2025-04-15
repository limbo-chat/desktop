import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Sidebar, SidebarGroup, SidebarItem } from "../../components/sidebar";

export const Route = createFileRoute("/design-playground")({
	component: DesignPlaygroundLayout,
});

const DesignSystemSidebar = () => {
	return (
		<Sidebar>
			<SidebarGroup title="Design system">
				<Link to="/design-playground/design-system/colors">
					{({ isActive }) => <SidebarItem isActive={isActive}>Colors</SidebarItem>}
				</Link>
			</SidebarGroup>
			<SidebarGroup title="Elements">
				<Link to="/design-playground/elements/button">
					{({ isActive }) => <SidebarItem isActive={isActive}>Button</SidebarItem>}
				</Link>
				<Link to="/design-playground/elements/markdown">
					{({ isActive }) => <SidebarItem isActive={isActive}>Markdown</SidebarItem>}
				</Link>
			</SidebarGroup>
		</Sidebar>
	);
};

function DesignPlaygroundLayout() {
	return (
		<div className="design-system-page">
			<DesignSystemSidebar />
			<div className="design-system-content">
				<Outlet />
			</div>
		</div>
	);
}
