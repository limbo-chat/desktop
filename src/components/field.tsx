import clsx from "clsx";
import type { HTMLAttributes } from "react";
import "./field.scss";
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

export const Field = ({ variant, className, children }: FieldProps) => {
	return <div className={fieldVariants({ className, variant })}>{children}</div>;
};

export interface FieldInfoProps extends HTMLAttributes<HTMLDivElement> {}

export const FieldInfo = ({ className, children }: FieldInfoProps) => {
	return <div className={clsx("field-info", className)}>{children}</div>;
};

export interface FieldLabelProps extends HTMLAttributes<HTMLLabelElement> {}

export const FieldLabel = ({ className, children }: FieldLabelProps) => {
	return <label className={clsx("field-label", className)}>{children}</label>;
};

export interface FieldDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const FieldDescription = ({ className, children }: FieldDescriptionProps) => {
	return <p className={clsx("field-description", className)}>{children}</p>;
};
