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

export const Field = ({ variant, className, ...divProps }: FieldProps) => {
	return <div className={fieldVariants({ className, variant })} {...divProps} />;
};

export interface FieldInfoProps extends HTMLAttributes<HTMLDivElement> {}

export const FieldInfo = ({ className, ...divProps }: FieldInfoProps) => {
	return <div className={clsx("field-info", className)} {...divProps} />;
};

export interface FieldLabelProps extends HTMLAttributes<HTMLLabelElement> {}

export const FieldLabel = ({ className, ...labelProps }: FieldLabelProps) => {
	return <label className={clsx("field-label", className)} {...labelProps} />;
};

export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const FieldDescription = ({ className, ...pProps }: FieldDescriptionProps) => {
	return <p className={clsx("field-description", className)} {...pProps} />;
};
