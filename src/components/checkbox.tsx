import * as RadixCheckbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

export interface CheckboxProps extends RadixCheckbox.CheckboxProps {}

export const Checkbox = (props: CheckboxProps) => {
	return (
		<RadixCheckbox.Root className="checkbox">
			<RadixCheckbox.Indicator className="checkbox-indicator">
				<CheckIcon />
			</RadixCheckbox.Indicator>
		</RadixCheckbox.Root>
	);
};
