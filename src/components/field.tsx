import type { FieldRootProps } from "@ark-ui/react";
import { cva, type VariantProps } from "class-variance-authority";
import clsx from "clsx";
import { createContext, useContext, useId, type HTMLAttributes, type ReactNode } from "react";
import { PasswordInput, type PasswordInputProps } from "./inputs/password-input";
import { TextInput, type TextInputProps } from "./inputs/text-input";

// TODO, there is more work to be done in making the form interactions accessible and semantic.
// selects, checkboxes, textarea, ... custom controls

export interface FieldContext {
	id: string;
	hasError: boolean;
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
	const { id, hasError } = useFieldContext();

	return {
		id,
		"aria-describedby": `${id}-description${hasError ? ` ${id}-error` : ""}`,
		"aria-invalid": hasError,
	};
};

const fieldVariants = cva("field", {
	variants: {
		variant: {
			horizontal: "field--horizontal",
		},
	},
});

export interface FieldProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof fieldVariants> {
	hasError?: boolean;
}

export const FieldRoot = ({ hasError = false, variant, className, ...props }: FieldProps) => {
	const id = useId();

	return (
		<fieldContext.Provider value={{ id, hasError }}>
			<div
				className={fieldVariants({ className, variant })}
				{...props}
				data-invalid={hasError ?? undefined}
			/>
		</fieldContext.Provider>
	);
};

export interface FieldLabelProps extends HTMLAttributes<HTMLLabelElement> {}

export const FieldLabel = ({ className, ...props }: FieldLabelProps) => {
	const { id } = useFieldContext();

	return <label htmlFor={id} className={clsx("field-label", className)} {...props} />;
};

export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const FieldDescription = ({ className, ...props }: FieldDescriptionProps) => {
	const { id } = useFieldContext();

	return (
		<p id={`${id}:description`} className={clsx("field-description", className)} {...props} />
	);
};

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {}

export const FieldError = ({ className, ...props }: FieldErrorProps) => {
	const { id } = useFieldContext();

	return <div id={`${id}:error`} className={clsx("field-error", className)} {...props} />;
};

// implementations

export interface FieldProps extends Omit<FieldRootProps, "children"> {
	label?: string;
	description?: string;
	error?: string;
	control?: ReactNode;
}

export const Field = ({ label, description, error, control, ...rootProps }: FieldProps) => {
	return (
		<FieldRoot className="field" hasError={!!error} {...rootProps}>
			{label && <FieldLabel>{label}</FieldLabel>}
			{description && <FieldDescription>{description}</FieldDescription>}
			{control}
			{error && <FieldError>{error}</FieldError>}
		</FieldRoot>
	);
};

export const InlineField = ({ label, description, error, control, ...rootProps }: FieldProps) => {
	return (
		<FieldRoot className="inline-field" hasError={!!error} {...rootProps}>
			{control}
			<div className="inline-field-info">
				{label && <FieldLabel>{label}</FieldLabel>}
				{description && <FieldDescription>{description}</FieldDescription>}
				{error && <FieldError>{error}</FieldError>}
			</div>
		</FieldRoot>
	);
};

export const FieldTextInput = (props: TextInputProps) => {
	const accessbilityProps = useFieldControlAccessibilityProps();

	return <TextInput {...accessbilityProps} {...props} />;
};

export interface TextInputFieldProps extends FieldProps, FieldRootProps {
	textInputProps?: TextInputProps;
}

export const TextInputField = ({ textInputProps, ...fieldProps }: TextInputFieldProps) => {
	return <Field control={<FieldTextInput {...textInputProps} />} {...fieldProps} />;
};

export const FieldPasswordInput = (props: PasswordInputProps) => {
	const accessbilityProps = useFieldControlAccessibilityProps();

	return <PasswordInput {...accessbilityProps} {...props} />;
};

export interface PasswordInputFieldProps extends FieldProps, FieldRootProps {
	passwordInputProps?: PasswordInputProps;
}

export const PasswordInputField = ({
	passwordInputProps,
	...fieldProps
}: PasswordInputFieldProps) => {
	return <Field control={<FieldPasswordInput {...passwordInputProps} />} {...fieldProps} />;
};
