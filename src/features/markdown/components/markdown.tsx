import type { HTMLAttributes } from "react";
import clsx from "clsx";
import "./markdown.scss";

export interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {}

export const Markdown = ({ className, ...divProps }: MarkdownProps) => {
	return <div className={clsx("markdown", className)} {...divProps} />;
};

/* 
	will be used in the future
	<MarkdownToJsx
options={{
	overrides: {
		a: {
			props: {
				target: "_blank",
			},
		},
		input: {
			props: {
				disabled: true,
			},
		},
		code: (props) => (
			<CodeBlock
				lang={
					props.className ? props.className.split("lang-")[1] : undefined
				}
				content={props.children}
			/>
		),
	},
}}
>
{content}
</MarkdownToJsx> */
