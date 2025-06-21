import * as RadixPopover from "@radix-ui/react-popover";
import clsx from "clsx";

export interface PopoverRootProps extends RadixPopover.PopoverProps {}

export const PopoverRoot = RadixPopover.Root;

export interface PopoverTriggerProps extends RadixPopover.PopoverTriggerProps {}

export const PopoverTrigger = RadixPopover.Trigger;

export const PopoverAnchor = RadixPopover.Anchor;

export interface PopoverContentProps extends RadixPopover.PopoverContentProps {}

export const PopoverContent = ({ className, ...props }: PopoverContentProps) => {
	return (
		<RadixPopover.Portal>
			<RadixPopover.Content className={clsx("popover")} {...props} />
		</RadixPopover.Portal>
	);
};
