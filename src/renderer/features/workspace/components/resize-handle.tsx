import clsx from "clsx";

export interface ResizeHandleProps extends React.ComponentProps<"div"> {}

export const ResizeHandle = ({ className, ...props }: ResizeHandleProps) => {
	return <div className={clsx("resize-handle", className)} {...props} />;
};
