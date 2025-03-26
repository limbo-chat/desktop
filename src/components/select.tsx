import {
	Select as ArkSelect,
	Portal as ArkPortal,
	type PortalProps as ArkPortalProps,
} from "@ark-ui/react";
import type { PropsWithChildren } from "react";

export const SelectRoot = ArkSelect.Root;

export const SelectLabel = ArkSelect.Label;

export const SelectControl = ArkSelect.Control;

export const SelectTrigger = ArkSelect.Trigger;

export const SelectValueText = ArkSelect.ValueText;

export const SelectIndicator = ArkSelect.Indicator;

export const SelectContent = ({ children }: PropsWithChildren<ArkPortalProps>) => {
	return (
		<ArkPortal>
			<ArkSelect.Positioner>
				<ArkSelect.Content className="bg-surface-alt">{children}</ArkSelect.Content>
			</ArkSelect.Positioner>
		</ArkPortal>
	);
};

export const SelectItemGroup = ArkSelect.ItemGroup;

export const SelectItemGroupLabel = ArkSelect.ItemGroupLabel;

export const SelectItem = ArkSelect.Item;
export const SelectItemText = ArkSelect.ItemText;
