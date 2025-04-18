import { Checkbox as ArkCheckbox } from "@ark-ui/react";
import { CheckIcon } from "lucide-react";
import "./checkbox.scss";

export interface CheckboxProps extends ArkCheckbox.RootProps {}

export const Checkbox = (props: CheckboxProps) => {
	return (
		<ArkCheckbox.Root className="checkbox" {...props}>
			<ArkCheckbox.Control className="checkbox-control">
				<ArkCheckbox.Indicator className="checkbox-indicator">
					<CheckIcon size={18} />
				</ArkCheckbox.Indicator>
			</ArkCheckbox.Control>
			<ArkCheckbox.HiddenInput />
		</ArkCheckbox.Root>
	);
};
