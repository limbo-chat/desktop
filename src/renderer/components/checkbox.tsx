import * as RadixCheckbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { AppIcon } from "./app-icon";

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {}

export const Checkbox = ({ className, ...props }: CheckboxProps) => {
	return (
		<RadixCheckbox.Root className={clsx("checkbox", className)} {...props}>
			<RadixCheckbox.Indicator className="checkbox-indicator">
				<AppIcon icon="check" />
			</RadixCheckbox.Indicator>
		</RadixCheckbox.Root>
	);
};
