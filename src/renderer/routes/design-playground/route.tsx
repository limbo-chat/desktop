import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import {
	Sidebar,
	SidebarSection,
	SidebarSectionHeader,
	SidebarSectionTitle,
	SidebarSectionContent,
	SidebarItem,
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
					<Link to="/design-playground/elements/button">
						{({ isActive }) => <SidebarItem isActive={isActive}>Button</SidebarItem>}
					</Link>
					<Link to="/design-playground/elements/tooltip">
						{({ isActive }) => <SidebarItem isActive={isActive}>Tooltip</SidebarItem>}
					</Link>
					<Link to="/design-playground/elements/form">
						{({ isActive }) => <SidebarItem isActive={isActive}>Form</SidebarItem>}
					</Link>
					<Link to="/design-playground/elements/dialog">
						{({ isActive }) => <SidebarItem isActive={isActive}>Dialog</SidebarItem>}
					</Link>
					<Link to="/design-playground/elements/markdown">
						{({ isActive }) => <SidebarItem isActive={isActive}>Markdown</SidebarItem>}
					</Link>
					<Link to="/design-playground/elements/llm-picker">
						{({ isActive }) => (
							<SidebarItem isActive={isActive}>LLM picker</SidebarItem>
						)}
					</Link>
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
