import { Switch as ArkSwitch } from "@ark-ui/react";
import clsx from "clsx";

export interface SwitchProps extends Omit<ArkSwitch.RootProps, "children"> {}

export const Switch = ({ className, ...props }: SwitchProps) => {
	return (
		<ArkSwitch.Root className={clsx("switch", className)} {...props}>
			<ArkSwitch.Control className="switch-control">
				<ArkSwitch.Thumb className="switch-thumb" />
			</ArkSwitch.Control>
			<ArkSwitch.HiddenInput />
		</ArkSwitch.Root>
	);
};
