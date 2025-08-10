import * as RadixMenu from "@radix-ui/react-dropdown-menu";
import clsx from "clsx";

export interface MenuRootProps extends RadixMenu.DropdownMenuProps {}

export const MenuRoot = RadixMenu.Root;

export interface MenuTriggerProps extends RadixMenu.DropdownMenuTriggerProps {}

export const MenuTrigger = RadixMenu.Trigger;

export interface MenuContentProps extends RadixMenu.DropdownMenuContentProps {}

export const MenuContent = ({ className, ...props }: MenuContentProps) => {
	return (
		<RadixMenu.Portal>
			<RadixMenu.Content className={clsx("menu", className)} {...props} />
		</RadixMenu.Portal>
	);
};

// menu sections

export interface MenuSectionProps extends RadixMenu.DropdownMenuGroupProps {}

export const MenuSection = ({ className, ...props }: MenuSectionProps) => {
	return <RadixMenu.Group className={clsx("menu-section", className)} {...props} />;
};

export interface MenuSectionHeaderProps extends React.ComponentProps<"div"> {}

export const MenuSectionHeader = ({ className, ...props }: MenuSectionProps) => {
	return <div className={clsx("menu-section-header", className)} {...props} />;
};

export interface MenuSectionHeaderProps extends React.ComponentProps<"div"> {}

export const MenuSectionLabel = ({ className, ...props }: MenuSectionProps) => {
	return <RadixMenu.Label className={clsx("menu-section-label", className)} {...props} />;
};

export interface MenuSectionContentProps extends React.ComponentProps<"div"> {}

export const MenuSectionContent = ({ className, ...props }: MenuSectionProps) => {
	return <div className={clsx("menu-section-content", className)} {...props} />;
};

// menu items

export interface MenuItemProps extends RadixMenu.DropdownMenuItemProps {}

export const MenuItem = ({ className, ...props }: MenuItemProps) => {
	return <RadixMenu.Item className={clsx("menu-item", className)} {...props} />;
};

export interface MenuItemLabelProps extends React.ComponentProps<"div"> {}

export const MenuItemLabel = ({ className, ...props }: MenuItemLabelProps) => {
	return <div className={clsx("menu-item-label", className)} {...props} />;
};

export interface MenuItemIconProps extends React.ComponentProps<"div"> {}

export const MenuItemIcon = ({ className, ...props }: MenuItemIconProps) => {
	return <div className={clsx("menu-item-icon", className)} {...props} />;
};
