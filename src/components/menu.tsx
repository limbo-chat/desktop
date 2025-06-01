import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface MenuRootProps extends RadixMenu.DropdownMenuProps {}

export const MenuRoot = RadixMenu.Root;

export interface MenuTriggerProps extends RadixMenu.DropdownMenuTriggerProps {}

export const MenuTrigger = ({ className, ...props }: MenuTriggerProps) => {
	return <RadixMenu.Trigger className={clsx("menu-trigger", className)} {...props} />;
};

export interface MenuContentProps extends RadixMenu.DropdownMenuContentProps {}

export const MenuContent = ({ className, ...props }: MenuContentProps) => {
	return (
		<RadixMenu.Portal>
			<RadixMenu.Content className={clsx("menu-content", className)} {...props} />
		</RadixMenu.Portal>
	);
};

export interface MenuGroupProps extends RadixMenu.DropdownMenuGroupProps {}

export const MenuGroup = ({ className, ...props }: MenuGroupProps) => {
	return <RadixMenu.Group className={clsx("menu-group", className)} {...props} />;
};

export interface MenuItemProps extends RadixMenu.DropdownMenuItemProps {}

export const MenuItem = ({ className, ...props }: MenuItemProps) => {
	return <RadixMenu.Item className={clsx("menu-item", className)} {...props} />;
};

export interface MenuItemTextProps extends HTMLAttributes<HTMLDivElement> {}

export const MenuItemLabel = ({ className, ...props }: MenuItemTextProps) => {
	return <div className={clsx("menu-item-label", className)} {...props} />;
};

export const MenuItemIcon = ({ className, ...props }: MenuItemTextProps) => {
	return <div className={clsx("menu-item-icon", className)} {...props} />;
};

export interface MenuSeparatorProps extends RadixMenu.DropdownMenuSeparatorProps {}

export const MenuSeparator = ({ className, ...props }: MenuSeparatorProps) => {
	return <RadixMenu.Separator className={clsx("menu-separator", className)} {...props} />;
};
