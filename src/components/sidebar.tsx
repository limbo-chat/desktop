import clsx from "clsx";
import type { HTMLAttributes, PropsWithChildren, ReactNode } from "react";
import "./sidebar.scss";

export interface SidebarGroupProps {
	title: ReactNode;
}

// consider decomposing these components  into inidividual components that will be composed
export const SidebarGroup = ({ title, children }: PropsWithChildren<SidebarGroupProps>) => {
	return (
		<div className="sidebar-group">
			<span className="sidebar-group-title">{title}</span>
			<div className="sidebar-group-content">{children}</div>
		</div>
	);
};

export interface SidebarItemProps {
	isActive: boolean;
}

export const SidebarItem = ({ isActive, children }: PropsWithChildren<SidebarItemProps>) => {
	return (
		<div className="sidebar-item" data-active={isActive || undefined}>
			{children}
		</div>
	);
};

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className, children }: PropsWithChildren<SidebarProps>) => {
	return <div className={clsx("sidebar", className)}>{children}</div>;
};
