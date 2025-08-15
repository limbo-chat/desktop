import clsx from "clsx";

export interface BadgeProps extends React.ComponentProps<"div"> {}

export const Badge = ({ className, ...props }: BadgeProps) => {
	return <span className={clsx("badge", className)} {...props} />;
};
