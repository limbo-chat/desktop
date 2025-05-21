import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {}

export const Markdown = ({ className, ...divProps }: MarkdownProps) => {
	return <div className={clsx("markdown", className)} {...divProps} />;
};
