import clsx from "clsx";

export interface LoadingBarProps extends React.ComponentProps<"div"> {}

export const LoadingBar = ({ className, ...props }: LoadingBarProps) => {
	return <div className={clsx("loading-bar", className)} {...props} />;
};
