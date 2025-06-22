import * as RadixTooltip from "@radix-ui/react-tooltip";

export interface TooltipProps extends RadixTooltip.TooltipProps {
	label: string;
	contentProps?: RadixTooltip.TooltipContentProps;
}

export const Tooltip = ({ label, contentProps, children, ...props }: TooltipProps) => {
	return (
		<RadixTooltip.Provider>
			<RadixTooltip.Root {...props}>
				<RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
				<RadixTooltip.Portal>
					<RadixTooltip.Content className="tooltip" sideOffset={5} {...contentProps}>
						{label}
					</RadixTooltip.Content>
				</RadixTooltip.Portal>
			</RadixTooltip.Root>
		</RadixTooltip.Provider>
	);
};
