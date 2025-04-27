import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, ...props }: CardProps) => {
	return <div className={clsx("card", className)} {...props} />;
};

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const CardHeader = ({ className, ...props }: CardHeaderProps) => {
	return <div className={clsx("card-header", className)} {...props} />;
};

export interface CardTitleProps extends HTMLAttributes<HTMLSpanElement> {}

export const CardTitle = ({ className, ...props }: CardTitleProps) => {
	return <span className={clsx("card-title", className)} {...props} />;
};

export interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {}

export const CardDescription = ({ className, ...props }: CardDescriptionProps) => {
	return <p className={clsx("card-description", className)} {...props} />;
};

export interface CardContentProps extends HTMLAttributes<HTMLDivElement> {}

export const CardContent = ({ className, ...props }: CardContentProps) => {
	return <div className={clsx("card-content", className)} {...props} />;
};
