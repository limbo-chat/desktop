import { Link as RouterLink, type LinkProps as RouterLinkProps } from "@tanstack/react-router";

export interface LinkProps extends RouterLinkProps {
	className?: string;
}

export const Link = ({ activeProps, ...props }: LinkProps) => {
	return <RouterLink activeProps={{ className: undefined, ...activeProps }} {...props} />;
};
