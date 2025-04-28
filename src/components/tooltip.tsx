import { Tooltip as ArkTooltip } from "@ark-ui/react/tooltip";
import type { PropsWithChildren } from "react";

export interface TooltipProps extends ArkTooltip.RootProps {
	label: string;
}

export const Tooltip = ({ label, children, ...props }: PropsWithChildren<TooltipProps>) => {
	return (
		<ArkTooltip.Root {...props}>
			<ArkTooltip.Trigger asChild>{children}</ArkTooltip.Trigger>
			<ArkTooltip.Positioner>
				<ArkTooltip.Content className="tooltip">{label}</ArkTooltip.Content>
			</ArkTooltip.Positioner>
		</ArkTooltip.Root>
	);
};
