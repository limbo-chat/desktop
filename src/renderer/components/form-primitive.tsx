import clsx from "clsx";
import { Button, type ButtonProps } from "./button";

export interface RootProps extends React.ComponentProps<"form"> {
	/** an identifier for the form */
	id?: string;

	as?: React.ElementType;
}

export const Root = ({ id, as: Component = "form", className, ...props }: RootProps) => {
	return <Component className={clsx("form", className)} data-form={id} {...props} />;
};

// form header

export interface HeaderProps extends React.ComponentProps<"div"> {}

export const Header = ({ className, ...props }: HeaderProps) => {
	return <div className={clsx("form-header", className)} {...props} />;
};

export interface TitleProps extends React.ComponentProps<"div"> {}

export const Title = ({ className, ...props }: TitleProps) => {
	return <div className={clsx("form-title", className)} {...props} />;
};

export interface DescriptionProps extends React.ComponentProps<"div"> {}

export const Description = ({ className, ...props }: DescriptionProps) => {
	return <div className={clsx("form-description", className)} {...props} />;
};

export interface ContentProps extends React.ComponentProps<"div"> {}

export const Content = ({ className, ...props }: ContentProps) => {
	return <div className={clsx("form-content")} {...props} />;
};

// form sections

export interface SectionProps extends React.ComponentProps<"div"> {
	/* an identifier of the section */
	id?: string;
}

export const Section = ({ id, className, ...props }: SectionProps) => {
	return <div data-section={id} className={clsx("form-section")} {...props} />;
};

export interface SectionHeaderProps extends React.ComponentProps<"div"> {}

export const SectionHeader = ({ className, ...props }: SectionHeaderProps) => {
	return <div className={clsx("form-section-header")} {...props} />;
};

export interface SectionTitleProps extends React.ComponentProps<"div"> {}

export const SectionTitle = ({ className, ...props }: SectionTitleProps) => {
	return <div className={clsx("form-section-title", className)} {...props} />;
};

export interface SectionDescriptionProps extends React.ComponentProps<"div"> {}

export const SectionDescription = ({ className, ...props }: SectionDescriptionProps) => {
	return <div className={clsx("form-section-description", className)} {...props} />;
};

export interface SectionContentProps extends React.ComponentProps<"div"> {}

export const SectionContent = ({ className, ...props }: SectionContentProps) => {
	return <div className={clsx("form-section-content", className)} {...props} />;
};

// form footer

export interface FooterProps extends React.ComponentProps<"div"> {}

export const Footer = ({ className, ...props }: FooterProps) => {
	return <div className={clsx("form-footer")} {...props} />;
};

export interface FormActionsProps extends React.ComponentProps<"div"> {}

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
