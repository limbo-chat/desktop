import type { PropsWithChildren } from "react";
import {
	Select as ArkSelect,
	Portal as ArkPortal,
	type PortalProps as ArkPortalProps,
	type ListCollection,
} from "@ark-ui/react";
import { ChevronsUpDownIcon } from "lucide-react";
import clsx from "clsx";
import "./select.scss";

export interface SelectRootProps extends ArkSelect.RootProps<any> {}

export const SelectRoot = ({ className, ...props }: SelectRootProps) => {
	return <ArkSelect.Root className={clsx("select", className)} {...props} />;
};

export interface SelectLabelProps extends ArkSelect.LabelProps {}

export const SelectLabel = ({ className, ...props }: SelectLabelProps) => {
	return <ArkSelect.Label className={clsx("select-label", className)} {...props} />;
};

export interface SelectControlProps extends ArkSelect.ControlProps {}

export const SelectControl = ({ className, ...props }: SelectControlProps) => {
	return <ArkSelect.Control className={clsx("select-control", className)} {...props} />;
};

export interface SelectTriggerProps extends ArkSelect.TriggerProps {}

export const SelectTrigger = ({ className, ...props }: SelectTriggerProps) => {
	return <ArkSelect.Trigger className={clsx("select-trigger", className)} {...props} />;
};

export interface SelectValueTextProps extends ArkSelect.ValueTextProps {}

export const SelectValueText = ({ className, ...props }: SelectValueTextProps) => {
	return <ArkSelect.ValueText className={clsx("select-value-text", className)} {...props} />;
};

export interface SelectIndicatorProps extends ArkSelect.IndicatorProps {}

export const SelectIndicator = ({ className, children, ...props }: SelectValueTextProps) => {
	return (
		<ArkSelect.Indicator className={clsx("select-indicator", className)} {...props}>
			{children ?? <ChevronsUpDownIcon />}
		</ArkSelect.Indicator>
	);
};

export const SelectContent = ({ children }: PropsWithChildren<ArkPortalProps>) => {
	return (
		<ArkPortal>
			<ArkSelect.Positioner className="select-positioner">
				<ArkSelect.Content className="select-content">{children}</ArkSelect.Content>
			</ArkSelect.Positioner>
		</ArkPortal>
	);
};

export interface SelectItemProps extends ArkSelect.ItemProps {}

export const SelectItem = ({ className, ...props }: SelectItemProps) => {
	return <ArkSelect.Item className={clsx("select-item", className)} {...props} />;
};

export interface SelectItemTextProps extends ArkSelect.ItemTextProps {}

export const SelectItemText = ({ className, ...props }: SelectItemTextProps) => {
	return <ArkSelect.ItemText className={clsx("select-item-text", className)} {...props} />;
};

export interface SelectItemIndicatorProps extends ArkSelect.ItemIndicatorProps {}

export const SelectItemIndicator = ({
	className,
	children,
	...props
}: SelectItemIndicatorProps) => {
	return (
		<ArkSelect.ItemIndicator className="select-item-indicator" {...props}>
			{children ?? "✓"}
		</ArkSelect.ItemIndicator>
	);
};

export const SelectItemGroup = ArkSelect.ItemGroup;
export const SelectItemGroupLabel = ArkSelect.ItemGroupLabel;

export const SelectHiddenSelect = ArkSelect.HiddenSelect;

export interface SelectProps extends ArkSelect.RootProps<any> {}

export const Select = ({ children, ...rootProps }: PropsWithChildren<SelectProps>) => {
	return (
		<SelectRoot {...rootProps}>
			<SelectControl>
				<SelectTrigger>
					<SelectValueText />
					<SelectIndicator />
				</SelectTrigger>
			</SelectControl>
			<SelectContent>{children}</SelectContent>
			<SelectHiddenSelect />
		</SelectRoot>
	);
};
