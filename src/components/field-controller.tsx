import { createContext, useContext, type InputHTMLAttributes, type PropsWithChildren } from "react";
import { useController } from "react-hook-form";
import { Field, type FieldProps } from "./field";
import * as FieldPrimitive from "./field-primitive";
import * as RadioGroupPrimitive from "./radio-group-primitive";

export interface ControllerProps {
	/** the name of the field for react hook form */
	name: string;
}

const fieldControllerContext = createContext<ControllerProps | null>(null);

const useFieldControllerContext = () => {
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
			<Field error={fieldState.error?.message} {...fieldProps}>
				{children}
			</Field>
		</fieldControllerContext.Provider>
	);
};

export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
	const { name } = useFieldControllerContext();
	const { field } = useController({ name });

	return <FieldPrimitive.TextInput {...field} value={field.value || ""} {...props} />;
};

export const Textarea = (props: InputHTMLAttributes<HTMLTextAreaElement>) => {
	const { name } = useFieldControllerContext();
	const { field } = useController({ name });

	return <FieldPrimitive.Textarea {...field} value={field.value || ""} {...props} />;
};

export const RadioGroup = (props: RadioGroupPrimitive.RootProps) => {
	const { name } = useFieldControllerContext();
	const { field } = useController({ name });

	return (
		<FieldPrimitive.RadioGroup
			value={field.value ?? null}
			onValueChange={field.onChange}
			{...props}
		/>
	);
};
