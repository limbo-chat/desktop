import * as RadixCheckbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { AppIcon } from "./app-icon";

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {}

export const Checkbox = ({ checked, className, ...props }: CheckboxProps) => {
	return (
		<RadixCheckbox.Root className={clsx("checkbox", className)} checked={checked} {...props}>
			<RadixCheckbox.Indicator className="checkbox-indicator">
				{checked === "indeterminate" ? <AppIcon icon="remove" /> : <AppIcon icon="check" />}
			</RadixCheckbox.Indicator>
		</RadixCheckbox.Root>
	);
};
