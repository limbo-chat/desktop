import * as RadioGroupPrimitive from "./radio-group-primitive";

export interface RadioOptionProps extends RadioGroupPrimitive.InputProps {
	id?: string;
	label: string;
}

export const RadioOption = ({ id, label, ...props }: RadioOptionProps) => {
	const idValue = id ?? props.value;

	return (
		<RadioGroupPrimitive.Option>
			<RadioGroupPrimitive.Input id={idValue} {...props} />
			<RadioGroupPrimitive.OptionLabel htmlFor={idValue}>
				{label}
			</RadioGroupPrimitive.OptionLabel>
		</RadioGroupPrimitive.Option>
	);
};
