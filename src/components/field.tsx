import type { HTMLAttributes } from "react";
import clsx from "clsx";
import { cva, type VariantProps } from "class-variance-authority";

const fieldVariants = cva("field", {
	variants: {
		variant: {
			horizontal: "field--horizontal",
		},
	},
});

export interface FieldProps
	extends HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof fieldVariants> {}

export const Field = ({ variant, className, ...props }: FieldProps) => {
	return <div className={fieldVariants({ className, variant })} {...props} />;
};

export interface FieldInfoProps extends HTMLAttributes<HTMLDivElement> {}

export const FieldInfo = ({ className, ...props }: FieldInfoProps) => {
	return <div className={clsx("field-info", className)} {...props} />;
};

export interface FieldLabelProps extends HTMLAttributes<HTMLLabelElement> {}

export const FieldLabel = ({ className, ...props }: FieldLabelProps) => {
	return <label className={clsx("field-label", className)} {...props} />;
};

export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const FieldDescription = ({ className, ...props }: FieldDescriptionProps) => {
	return <p className={clsx("field-description", className)} {...props} />;
};

export interface FieldErrorProps extends HTMLAttributes<HTMLParagraphElement> {}

export const FieldError = ({ className, ...props }: FieldErrorProps) => {
	return <div className={clsx("field-error", className)} {...props} />;
};
