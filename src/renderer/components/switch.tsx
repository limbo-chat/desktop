import * as RadixSwitch from "@radix-ui/react-switch";
import clsx from "clsx";

export interface SwitchProps extends RadixSwitch.SwitchProps {}

export const Switch = ({ className, ...props }: SwitchProps) => {
	return (
		<RadixSwitch.Root className={clsx("switch", className)} {...props}>
			<RadixSwitch.Thumb className="switch-thumb" />
		</RadixSwitch.Root>
	);
};
