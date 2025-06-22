import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface MarkdownContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const MarkdownContainer = ({ className, ...divProps }: MarkdownContainerProps) => {
	return <div className={clsx("markdown", className)} {...divProps} />;
};
