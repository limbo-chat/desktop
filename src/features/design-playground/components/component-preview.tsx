import type { HTMLAttributes } from "react";
import clsx from "clsx";

export interface ComponentPreviewProps extends HTMLAttributes<HTMLDivElement> {}

export const ComponentPreview = ({ className, ...divProps }: ComponentPreviewProps) => {
	return <div className={clsx("component-preview", className)} {...divProps} />;
};

export interface ComponentPreviewContentProps extends HTMLAttributes<HTMLDivElement> {}

export const ComponentPreviewContent = ({
	className,
	...divProps
}: ComponentPreviewContentProps) => {
	return <div className={clsx("component-preview-content", className)} {...divProps} />;
};

export interface ComponentPreviewPanelProps extends HTMLAttributes<HTMLDivElement> {}

export const ComponentPreviewPanel = ({ className, ...divProps }: ComponentPreviewPanelProps) => {
	return <div className={clsx("component-preview-panel", className)} {...divProps} />;
};
