import clsx from "clsx";

export interface MarkdownContainerProps extends React.ComponentProps<"div"> {}

export const MarkdownContainer = ({ className, ...divProps }: MarkdownContainerProps) => {
	return <div className={clsx("markdown", className)} {...divProps} />;
};
