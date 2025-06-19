import * as RadioGroupPrimitives from "./radio-group-primitives";

export interface RadioOptionProps extends RadioGroupPrimitives.InputProps {
	id?: string;
	label: string;
}

export const RadioOption = ({ id, label, ...props }: RadioOptionProps) => {
	const idValue = id ?? props.value;

	return (
		<RadioGroupPrimitives.Option>
			<RadioGroupPrimitives.Input id={idValue} {...props} />
			<RadioGroupPrimitives.OptionLabel htmlFor={idValue}>
				{label}
			</RadioGroupPrimitives.OptionLabel>
		</RadioGroupPrimitives.Option>
	);
};
