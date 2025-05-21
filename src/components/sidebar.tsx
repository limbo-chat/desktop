import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className, children }: SidebarProps) => {
	return <div className={clsx("sidebar", className)}>{children}</div>;
};

export interface SidebarGroupProps extends HTMLAttributes<HTMLDivElement> {}

export const SidebarGroup = ({ className, ...props }: SidebarGroupProps) => {
	return <div className={clsx("sidebar-group", className)} {...props} />;
};

export interface SidebarGroupTitleProps extends HTMLAttributes<HTMLSpanElement> {}

export const SidebarGroupTitle = ({ className, ...props }: SidebarGroupProps) => {
	return <span className={clsx("sidebar-group-title", className)} {...props} />;
};

export interface SidebarGroupContentProps extends HTMLAttributes<HTMLDivElement> {}

export const SidebarGroupContent = ({ className, ...props }: SidebarGroupContentProps) => {
	return <div className={clsx("sidebar-group-content", className)} {...props} />;
};

export interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
	isActive?: boolean;
}

export const SidebarItem = ({ isActive, className, ...props }: SidebarItemProps) => {
	return <div className="sidebar-item" data-active={isActive || undefined} {...props} />;
};
