import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { Link, type LinkProps } from "./link";

export interface SidebarProps extends HTMLAttributes<HTMLDivElement> {}

export const Sidebar = ({ className, children }: SidebarProps) => {
	return <div className={clsx("sidebar", className)}>{children}</div>;
};

// sections

export interface SidebarSectionProps extends HTMLAttributes<HTMLDivElement> {}

export const SidebarSection = ({ className, ...props }: SidebarSectionProps) => {
	return <div className={clsx("sidebar-section", className)} {...props} />;
};

export interface SidebarSectionHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const SidebarSectionHeader = ({ className, ...props }: SidebarSectionHeaderProps) => {
	return <div className={clsx("sidebar-section-header", className)} {...props} />;
};

export interface SidebarSectionTitleProps extends HTMLAttributes<HTMLSpanElement> {}

export const SidebarSectionTitle = ({ className, ...props }: SidebarSectionProps) => {
	return <span className={clsx("sidebar-section-title", className)} {...props} />;
};

export interface SidebarSectionContentProps extends HTMLAttributes<HTMLDivElement> {}

export const SidebarSectionContent = ({ className, ...props }: SidebarSectionContentProps) => {
	return <div className={clsx("sidebar-section-content", className)} {...props} />;
};

// items

export interface SidebarItemProps extends HTMLAttributes<HTMLDivElement> {
	isActive?: boolean;
}

export const SidebarItem = ({ isActive, className, ...props }: SidebarItemProps) => {
	return (
		<div
			className={clsx("sidebar-item", className)}
			data-active={isActive || undefined}
			{...props}
		/>
	);
};

export interface SidebarLinkItemProps extends LinkProps {
	isActive?: boolean;
}

export const SidebarLinkItem = ({
	isActive,
	className,
	activeProps,
	...props
}: SidebarLinkItemProps) => {
	return (
		<Link
			className={clsx("sidebar-item")}
			data-active={isActive || undefined}
			activeProps={{
				"data-active": typeof isActive === "boolean" ? isActive : true,
				...activeProps,
			}}
			{...props}
		/>
	);
};

export interface SidebarItemIconProps extends HTMLAttributes<HTMLDivElement> {}

export const SidebarItemIcon = ({ className, ...props }: SidebarItemIconProps) => {
	return <div className={clsx("sidebar-item-icon", className)} {...props} />;
};

export interface SidebarItemLabelProps extends HTMLAttributes<HTMLDivElement> {}

export const SidebarItemLabel = ({ className, ...props }: SidebarItemLabelProps) => {
	return <div className={clsx("sidebar-item-label", className)} {...props} />;
};
