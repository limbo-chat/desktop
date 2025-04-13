import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import type { PropsWithChildren } from "react";
import "./tooltip.scss";

export interface TooltipProps {
	label: string;
}

export const Tooltip = ({ label, children }: PropsWithChildren<TooltipProps>) => {
	return (
		<ArkTooltip.Root>
			<ArkTooltip.Trigger asChild>{children}</ArkTooltip.Trigger>
			<ArkTooltip.Positioner>
				<ArkTooltip.Content className="tooltip">{label}</ArkTooltip.Content>
			</ArkTooltip.Positioner>
		</ArkTooltip.Root>
	);
};
