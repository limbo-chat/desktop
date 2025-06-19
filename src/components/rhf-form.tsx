import { useFormContext } from "react-hook-form";
import { type ButtonProps } from "./button";
import * as Form from "./form-primitive";

export const ResetButton = (props: ButtonProps) => {
	const form = useFormContext();

	return (
		<Form.CancelButton
			disabled={!form.formState.isDirty}
			onClick={() => form.reset()}
			{...props}
		/>
	);
};
