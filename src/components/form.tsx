import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface FormProps extends HTMLAttributes<HTMLFormElement> {}

export const Form = ({ className, ...props }: FormProps) => {
	return <form className={clsx("form", className)} {...props} />;
};

// form header

export interface FormHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const FormHeader = ({ className, ...props }: FormHeaderProps) => {
	return <div className={clsx("form-header", className)} {...props} />;
};

export interface FormTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const FormTitle = ({ className, ...props }: FormTitleProps) => {
	return <div className={clsx("form-title", className)} {...props} />;
};

export interface FormDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const FormDescription = ({ className, ...props }: FormDescriptionProps) => {
	return <div className={clsx("form-description", className)} {...props} />;
};

export interface FormContentProps extends HTMLAttributes<HTMLDivElement> {}

export const FormContent = ({ className, ...props }: FormContentProps) => {
	return <div className={clsx("form-content")} {...props} />;
};

// form sections

export interface FormSectionProps extends HTMLAttributes<HTMLDivElement> {}

export const FormSection = ({ className, ...props }: FormSectionProps) => {
	return <div className={clsx("form-section")} {...props} />;
};

export interface FormSectionHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const FormSectionHeader = ({ className, ...props }: FormSectionHeaderProps) => {
	return <div className={clsx("form-section-header")} {...props} />;
};

export interface FormSectionTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const FormSectionTitle = ({ className, ...props }: FormSectionTitleProps) => {
	return <div className={clsx("form-section-title", className)} {...props} />;
};

export interface FormSectionDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const FormSectionDescription = ({ className, ...props }: FormSectionDescriptionProps) => {
	return <div className={clsx("form-section-description", className)} {...props} />;
};

export interface FormSectionContentProps extends HTMLAttributes<HTMLDivElement> {}

export const FormSectionContent = ({ className, ...props }: FormSectionContentProps) => {
	return <div className={clsx("form-section-content", className)} {...props} />;
};

// form footer

export interface FormFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const FormFooter = ({ className, ...props }: FormFooterProps) => {
	return <div className={clsx("form-footer")} {...props} />;
};

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const FormActions = ({ className, ...props }: FormActionsProps) => {
	return <div className={clsx("form-actions")} {...props} />;
};
