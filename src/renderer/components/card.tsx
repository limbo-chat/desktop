import clsx from "clsx";

export interface CardProps extends React.ComponentProps<"div"> {}

export const Card = ({ className, ...props }: CardProps) => {
	return <div className={clsx("card", className)} {...props} />;
};

export interface CardHeaderProps extends React.ComponentProps<"div"> {}

export const CardHeader = ({ className, ...props }: CardHeaderProps) => {
	return <div className={clsx("card-header", className)} {...props} />;
};

export interface CardInfoProps extends React.ComponentProps<"div"> {}

export const CardInfo = ({ className, ...props }: CardInfoProps) => {
	return <div className={clsx("card-info", className)} {...props} />;
};

export interface CardActionProps extends React.ComponentProps<"div"> {}

export const CardAction = ({ className, ...props }: CardActionProps) => {
	return <div className={clsx("card-action", className)} {...props} />;
};

export interface CardTitleProps extends React.ComponentProps<"div"> {}

export const CardTitle = ({ className, ...props }: CardTitleProps) => {
	return <div className={clsx("card-title", className)} {...props} />;
};

export interface CardDescriptionProps extends React.ComponentProps<"p"> {}

export const CardDescription = ({ className, ...props }: CardDescriptionProps) => {
	return <p className={clsx("card-description", className)} {...props} />;
};

export interface CardContentProps extends React.ComponentProps<"div"> {}

export const CardContent = ({ className, ...props }: CardContentProps) => {
	return <div className={clsx("card-content", className)} {...props} />;
};

export interface CardFooterProps extends React.ComponentProps<"div"> {}

export const CardFooter = ({ className, ...props }: CardFooterProps) => {
	return <div className={clsx("card-footer", className)} {...props} />;
};

export interface CardActionsProps extends React.ComponentProps<"div"> {}

export const CardActions = ({ className, ...props }: CardActionsProps) => {
	return <div className={clsx("card-actions", className)} {...props} />;
};
