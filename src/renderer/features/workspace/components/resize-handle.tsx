import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface ResizeHandleProps extends HTMLAttributes<HTMLDivElement> {}

export const ResizeHandle = ({ className, ...props }: ResizeHandleProps) => {
	return <div className={clsx("resize-handle", className)} {...props} />;
};
