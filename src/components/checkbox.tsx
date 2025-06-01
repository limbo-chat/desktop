import * as RadixCheckbox from "@radix-ui/react-checkbox";
import clsx from "clsx";
import { CheckIcon } from "lucide-react";

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {}

export const Checkbox = ({ className, ...props }: CheckboxProps) => {
	return (
		<RadixCheckbox.Root className={clsx("checkbox")} {...props}>
			<RadixCheckbox.Indicator className="checkbox-indicator">
				<CheckIcon />
			</RadixCheckbox.Indicator>
		</RadixCheckbox.Root>
	);
};
