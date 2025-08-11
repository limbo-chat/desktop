import { clsx } from "clsx";

export interface AlertProps extends React.ComponentProps<"div"> {}

export const Alert = ({ className, ...props }: AlertProps) => {
	return <div className={clsx("alert", className)} role="alert" {...props} />;
};

export interface AlertIconProps extends React.ComponentProps<"div"> {}

export const AlertIcon = ({ className, ...props }: AlertProps) => {
	return <div className={clsx("alert-icon", className)} {...props} />;
};

export interface AlertContentProps extends React.ComponentProps<"div"> {}

export const AlertContent = ({ className, ...props }: AlertContentProps) => {
	return <div className={clsx("alert-content", className)} {...props} />;
};

export interface AlertInfoProps extends React.ComponentProps<"div"> {}

export const AlertInfo = ({ className, ...props }: AlertInfoProps) => {
	return <div className={clsx("alert-info", className)} {...props} />;
};

export interface AlertTitleProps extends React.ComponentProps<"div"> {}

export const AlertTitle = ({ className, ...props }: AlertTitleProps) => {
	return <div className={clsx("alert-title", className)} {...props} />;
};

export interface AlertDescriptionProps extends React.ComponentProps<"div"> {}

export const AlertDescription = ({ className, ...props }: AlertDescriptionProps) => {
	return <div className={clsx("alert-description", className)} {...props} />;
};

export interface AlertActionsProps extends React.ComponentProps<"div"> {}

export const AlertActions = ({ className, ...props }: AlertActionsProps) => {
	return <div className={clsx("alert-actions", className)} {...props} />;
};
