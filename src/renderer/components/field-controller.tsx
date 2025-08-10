import { createContext, useContext, type PropsWithChildren } from "react";
import { useController } from "react-hook-form";
import { Field as ComposedField, type FieldProps } from "./field";
import * as Field from "./field-primitive";
import * as RadioGroupPrimitive from "./radio-group-primitive";

export interface ControllerProps {
	/** the name of the field for react hook form */
	name: string;
}

const fieldControllerContext = createContext<ControllerProps | null>(null);

export const useFieldControllerContext = () => {
	const ctx = useContext(fieldControllerContext);

	if (!ctx) {
		throw new Error("useFieldControllerContext must be used within a FieldController");
	}

	return ctx;
};

export interface RootProps extends ControllerProps, FieldProps {}

export const Root = ({ name, children, ...fieldProps }: PropsWithChildren<RootProps>) => {
	const { fieldState } = useController({ name });

	return (
		<fieldControllerContext.Provider value={{ name }}>
			<ComposedField error={fieldState.error?.message} {...fieldProps}>
				{children}
			</ComposedField>
		</fieldControllerContext.Provider>
	);
};

export const TextInput = (props: React.ComponentProps<"input">) => {
	const { name } = useFieldControllerContext();
	const { field } = useController({ name });

	return <Field.TextInput {...field} value={field.value || ""} {...props} />;
};

export const Textarea = (props: React.ComponentProps<"textarea">) => {
	const { name } = useFieldControllerContext();
	const { field } = useController({ name });

	return <Field.Textarea {...field} value={field.value || ""} {...props} />;
};

export const RadioGroup = (props: RadioGroupPrimitive.RootProps) => {
	const { name } = useFieldControllerContext();
	const { field } = useController({ name });

	return (
		<Field.RadioGroup value={field.value ?? null} onValueChange={field.onChange} {...props} />
	);
};
