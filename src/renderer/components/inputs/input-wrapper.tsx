import clsx from "clsx";
import type { HTMLAttributes, PropsWithChildren, ReactNode } from "react";

export interface InputWrapperProps {
	className?: string;
	leftSection?: ReactNode;
	rightSection?: ReactNode;
}

export const InputWrapper = ({
	className,
	leftSection,
	rightSection,
	children,
	...props
}: PropsWithChildren<InputWrapperProps>) => {
	return (
		<div className={clsx("input-wrapper", className)} {...props}>
			{leftSection && (
				<div className="input-section" data-side="left">
					{leftSection}
				</div>
			)}
			{children}
			{rightSection && (
				<div className="input-section" data-side="right">
					{rightSection}
				</div>
			)}
		</div>
	);
};
