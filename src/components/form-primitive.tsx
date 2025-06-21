import clsx from "clsx";
import type { HTMLAttributes } from "react";
import { Button, type ButtonProps } from "./button";

export interface RootProps extends HTMLAttributes<HTMLFormElement> {
	/** an identifier for the form */
	id?: string;
}

export const Root = ({ id, className, ...props }: RootProps) => {
	return <form className={clsx("form", className)} data-form={id} {...props} />;
};

// form header

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const Header = ({ className, ...props }: HeaderProps) => {
	return <div className={clsx("form-header", className)} {...props} />;
};

export interface TitleProps extends HTMLAttributes<HTMLDivElement> {}

export const Title = ({ className, ...props }: TitleProps) => {
	return <div className={clsx("form-title", className)} {...props} />;
};

export interface DescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const Description = ({ className, ...props }: DescriptionProps) => {
	return <div className={clsx("form-description", className)} {...props} />;
};

export interface ContentProps extends HTMLAttributes<HTMLDivElement> {}

export const Content = ({ className, ...props }: ContentProps) => {
	return <div className={clsx("form-content")} {...props} />;
};

// form sections

export interface SectionProps extends HTMLAttributes<HTMLDivElement> {
	/* an identifier of the section */
	id?: string;
}

export const Section = ({ id, className, ...props }: SectionProps) => {
	return <div data-section={id} className={clsx("form-section")} {...props} />;
};

export interface SectionHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const SectionHeader = ({ className, ...props }: SectionHeaderProps) => {
	return <div className={clsx("form-section-header")} {...props} />;
};

export interface SectionTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const SectionTitle = ({ className, ...props }: SectionTitleProps) => {
	return <div className={clsx("form-section-title", className)} {...props} />;
};

export interface SectionDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const SectionDescription = ({ className, ...props }: SectionDescriptionProps) => {
	return <div className={clsx("form-section-description", className)} {...props} />;
};

export interface SectionContentProps extends HTMLAttributes<HTMLDivElement> {}

export const SectionContent = ({ className, ...props }: SectionContentProps) => {
	return <div className={clsx("form-section-content", className)} {...props} />;
};

// form footer

export interface FooterProps extends HTMLAttributes<HTMLDivElement> {}

export const Footer = ({ className, ...props }: FooterProps) => {
	return <div className={clsx("form-footer")} {...props} />;
};

export interface FormActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const Actions = ({ className, ...props }: FormActionsProps) => {
	return <div className={clsx("form-actions")} {...props} />;
};

// buttons

export const SubmitButton = (props: ButtonProps) => {
	return <Button type="submit" action="submit" {...props} />;
};

export const CancelButton = (props: ButtonProps) => {
	return <Button type="button" action="cancel" {...props} />;
};
