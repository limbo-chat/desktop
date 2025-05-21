import { Menu as ArkMenu } from "@ark-ui/react";
import clsx from "clsx";

export interface MenuRootProps extends ArkMenu.RootProps {}

export const MenuRoot = ArkMenu.Root;

export interface MenuTriggerProps extends ArkMenu.TriggerProps {}

export const MenuTrigger = ({ className, ...props }: MenuTriggerProps) => {
	return <ArkMenu.Trigger className={clsx("menu-trigger", className)} {...props} />;
};

export interface MenuPositionerProps extends ArkMenu.PositionerProps {}

export const MenuPositioner = ({ className, ...props }: MenuPositionerProps) => {
	return <ArkMenu.Positioner className={clsx("menu-positioner", className)} {...props} />;
};

export interface MenuContentProps extends ArkMenu.ContentProps {}

export const MenuContent = ({ className, ...props }: MenuContentProps) => {
	return <ArkMenu.Content className={clsx("menu-content", className)} {...props} />;
};

export interface MenuItemGroupProps extends ArkMenu.ItemGroupProps {}

export const MenuItemGroup = ({ className, ...props }: MenuItemProps) => {
	return <ArkMenu.ItemGroup className={clsx("menu-item-group", className)} {...props} />;
};

export interface MenuItemGroupLabelProps extends ArkMenu.ItemGroupLabelProps {}

export const MenuItemGroupLabel = ({ className, ...props }: MenuItemProps) => {
	return (
		<ArkMenu.ItemGroupLabel className={clsx("menu-item-group-label", className)} {...props} />
	);
};

export interface MenuItemProps extends ArkMenu.ItemProps {}

export const MenuItem = ({ className, ...props }: MenuItemProps) => {
	return <ArkMenu.Item className={clsx("menu-item", className)} {...props} />;
};

export interface MenuSeparatorProps extends ArkMenu.SeparatorProps {}

export const MenuSeparator = ({ className, ...props }: MenuItemProps) => {
	return <ArkMenu.Separator className={clsx("menu-separator", className)} {...props} />;
};
