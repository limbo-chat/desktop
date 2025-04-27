import type { HTMLAttributes } from "react";
import clsx from "clsx";

export interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {}

export const Markdown = ({ className, ...divProps }: MarkdownProps) => {
	return <div className={clsx("markdown", className)} {...divProps} />;
};
