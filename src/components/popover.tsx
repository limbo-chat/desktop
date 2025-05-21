import { Popover as ArkPopover } from "@ark-ui/react/popover";
import clsx from "clsx";

export interface PopoverRootProps extends ArkPopover.RootProps {}

export const PopoverRoot = ArkPopover.Root;

export interface PopoverTriggerProps extends ArkPopover.TriggerProps {}

export const PopoverTrigger = ({ className, ...props }: PopoverTriggerProps) => {
	return <ArkPopover.Trigger className={clsx("popover-trigger", className)} {...props} />;
};

export interface PopoverPositionerProps extends ArkPopover.PositionerProps {}

export const PopoverPositioner = ({ className, ...props }: PopoverPositionerProps) => {
	return <ArkPopover.Positioner className={clsx("popover-positioner", className)} {...props} />;
};

export interface PopoverContentProps extends ArkPopover.ContentProps {}

export const PopoverContent = ({ className, ...props }: PopoverContentProps) => {
	return <ArkPopover.Content className={clsx("popover-content", className)} {...props} />;
};

export interface PopoverTitleProps extends ArkPopover.TitleProps {}

export const PopoverTitle = ({ className, ...props }: PopoverTitleProps) => {
	return <ArkPopover.Title className={clsx("popover-title", className)} {...props} />;
};

export interface PopoverDescriptionProps extends ArkPopover.DescriptionProps {}

export const PopoverDescription = ({ className, ...props }: PopoverDescriptionProps) => {
	return <ArkPopover.Description className={clsx("popover-description", className)} {...props} />;
};
