import * as RadixRadioGroup from "@radix-ui/react-radio-group";
import clsx from "clsx";
import type { HTMLAttributes, LabelHTMLAttributes } from "react";

export interface RootProps extends RadixRadioGroup.RadioGroupProps {}

export const Root = ({ className, ...props }: RootProps) => {
	return <RadixRadioGroup.Root className={clsx("radio-group")} {...props} />;
};

export interface OptionProps extends HTMLAttributes<HTMLDivElement> {}

export const Option = ({ className, ...props }: OptionProps) => {
	return <div className={clsx("radio-option", className)} {...props} />;
};

export interface OptionLabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const OptionLabel = ({ className, ...props }: OptionLabelProps) => {
	return <label className={clsx("radio-option-label", className)} {...props} />;
};

export interface InputProps extends RadixRadioGroup.RadioGroupItemProps {}

export const Input = ({ className, ...props }: InputProps) => {
	return (
		<RadixRadioGroup.Item className={clsx("radio-input", className)} {...props}>
			<RadixRadioGroup.Indicator className="radio-input-indicator" />
		</RadixRadioGroup.Item>
	);
};
