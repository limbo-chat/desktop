import { Link as RouterLink, type LinkProps as RouterLinkProps } from "@tanstack/react-router";
import clsx from "clsx";

export interface LinkProps extends RouterLinkProps {
	className?: string;
}

export const Link = ({ activeProps, ...props }: LinkProps) => {
	return <RouterLink activeProps={{ className: undefined, ...activeProps }} {...props} />;
};

export const LinkButton = ({ className, ...props }: LinkProps) => {
	return <Link className={clsx("button", className)} {...props} />;
};
