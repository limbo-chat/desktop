import clsx from "clsx";
import {
	createContext,
	useContext,
	useMemo,
	type HTMLAttributes,
	type InputHTMLAttributes,
	type LabelHTMLAttributes,
} from "react";
import * as RadioGroupPrimitive from "./radio-group-primitive";

export interface FieldContext {
	id: string;
	isError: boolean;
	hasError: boolean;
	hasDescription: boolean;
}

const fieldContext = createContext<FieldContext | null>(null);

export const useFieldContext = () => {
	const ctx = useContext(fieldContext);

	if (!ctx) {
		throw new Error("useFieldContext must be used within a FieldRoot");
	}

	return ctx;
};

export const useFieldControlAccessibilityProps = () => {
	const { id, hasDescription, hasError } = useFieldContext();

	const ariaDescribedBy = useMemo(() => {
		let describedBy = "";

		if (hasDescription) {
			describedBy += `${id}-description`;
		}

		if (hasError) {
			describedBy += ` ${id}-error`;
		}

		return describedBy || undefined;
	}, [id, hasDescription, hasError]);

	return {
		id,
		"aria-invalid": hasError,
		"aria-describedby": ariaDescribedBy,
	};
};

export interface RootProps extends HTMLAttributes<HTMLDivElement> {
	/** an identifier for the field */
	id: string;
	isError?: boolean;
	hasDescription?: boolean;
	hasError?: boolean;
}

export const Root = ({
	id,
	isError = false,
	hasError = false,
	hasDescription = false,
	className,
	...props
}: RootProps) => {
	return (
		<fieldContext.Provider value={{ id, isError, hasError, hasDescription }}>
			<div
				className={clsx("field", className)}
				data-field={id}
				data-error={isError || undefined}
				{...props}
			/>
		</fieldContext.Provider>
	);
};

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = ({ className, ...props }: LabelProps) => {
	const { id } = useFieldContext();

	return <label htmlFor={id} className={clsx("field-label", className)} {...props} />;
};

export interface DescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const Description = ({ className, ...props }: DescriptionProps) => {
	const { id } = useFieldContext();

	return (
		<p id={`${id}-description`} className={clsx("field-description", className)} {...props} />
	);
};

export interface ErrorProps extends HTMLAttributes<HTMLParagraphElement> {}

const FieldError = ({ className, ...props }: ErrorProps) => {
	const { id } = useFieldContext();

	return <p id={`${id}-error`} className={clsx("field-error", className)} {...props} />;
};

export interface ControlProps extends HTMLAttributes<HTMLDivElement> {}

export const Control = ({ className, ...props }: ControlProps) => {
	return <div className={clsx("field-control", className)} {...props} />;
};

// controls

export const TextInput = (props: InputHTMLAttributes<HTMLInputElement>) => {
	const accessibilityProps = useFieldControlAccessibilityProps();

	return <input type="text" {...accessibilityProps} {...props} />;
};

export const Textarea = (props: InputHTMLAttributes<HTMLTextAreaElement>) => {
	const accessibilityProps = useFieldControlAccessibilityProps();

	return <textarea {...accessibilityProps} {...props} />;
};

export const RadioGroup = (props: RadioGroupPrimitive.RootProps) => {
	const accessibilityProps = useFieldControlAccessibilityProps();

	return <RadioGroupPrimitive.Root {...accessibilityProps} {...props} />;
};

export { FieldError as Error };
