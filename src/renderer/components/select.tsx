import * as RadixSelect from "@radix-ui/react-select";
import clsx from "clsx";
import type { PropsWithChildren } from "react";
import { AppIcon } from "./app-icon";

export interface SelectRootProps extends RadixSelect.SelectProps {}

export const SelectRoot = (props: SelectRootProps) => {
	return <RadixSelect.Root {...props} />;
};

export interface SelectTriggerProps extends RadixSelect.SelectTriggerProps {}

export const SelectTrigger = ({ className, children, ...props }: SelectTriggerProps) => {
	return (
		<RadixSelect.Trigger className={clsx("select-trigger", className)} {...props}>
			{children}
		</RadixSelect.Trigger>
	);
};

export interface SelectValueProps extends RadixSelect.SelectValueProps {}

export const SelectValue = ({ className, ...props }: SelectValueProps) => {
	return <RadixSelect.Value className={clsx("select-value", className)} {...props} />;
};

export interface SelectIconProps extends RadixSelect.SelectIconProps {}

export const SelectIcon = ({ className, ...props }: SelectIconProps) => {
	return (
		<RadixSelect.SelectIcon className={clsx("select-icon", className)} {...props}>
			<AppIcon icon="expand" />
		</RadixSelect.SelectIcon>
	);
};

export const SelectContent = ({ children }: PropsWithChildren) => {
	return (
		<RadixSelect.Portal>
			<RadixSelect.Content>
				<RadixSelect.Viewport>{children}</RadixSelect.Viewport>
			</RadixSelect.Content>
		</RadixSelect.Portal>
	);
};

export interface SelectItemProps extends RadixSelect.SelectItemProps {}

export const SelectItem = ({ className, children, ...props }: SelectItemProps) => {
	return (
		<RadixSelect.Item className={clsx("select-item", className)} {...props}>
			<RadixSelect.ItemText className="select-item-text">{children}</RadixSelect.ItemText>
			<RadixSelect.ItemIndicator className="select-item-indicator">
				<AppIcon icon="check" className="select-item-indicator-icon" />
			</RadixSelect.ItemIndicator>
		</RadixSelect.Item>
	);
};
