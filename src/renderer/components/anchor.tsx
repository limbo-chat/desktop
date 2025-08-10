import clsx from "clsx";

export interface AnchorProps extends React.ComponentProps<"a"> {}

export const Anchor = ({ className, ...props }: AnchorProps) => {
	return <a className={clsx("anchor", className)} {...props} />;
};
