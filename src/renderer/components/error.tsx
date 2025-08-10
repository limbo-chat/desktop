import clsx from "clsx";

export interface ErrorContainerProps extends React.ComponentProps<"div"> {}

export const ErrorContainer = ({ className, ...props }: ErrorContainerProps) => {
	return <div className={clsx("error-container", className)} {...props} />;
};

export interface ErrorRootProps extends React.ComponentProps<"div"> {}

export const ErrorRoot = ({ className, ...props }: ErrorRootProps) => {
	return <div className={clsx("error", className)} {...props} />;
};

export interface ErrorInfoProps extends React.ComponentProps<"div"> {}

export const ErrorInfo = ({ className, ...props }: ErrorInfoProps) => {
	return <div className={clsx("error-info", className)} {...props} />;
};

export interface ErrorTitleProps extends React.ComponentProps<"div"> {}

export const ErrorTitle = ({ className, ...props }: ErrorTitleProps) => {
	return <div className={clsx("error-title", className)} {...props} />;
};

export interface ErrorDescriptionProps extends React.ComponentProps<"div"> {}

export const ErrorDescription = ({ className, ...props }: ErrorDescriptionProps) => {
	return <div className={clsx("error-description", className)} {...props} />;
};

export interface ErrorControlProps extends React.ComponentProps<"div"> {}

export const ErrorControl = ({ className, ...props }: ErrorControlProps) => {
	return <div className={clsx("error-control")} {...props} />;
};
