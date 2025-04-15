import MarkdownToJsx from "markdown-to-jsx";
import "./markdown.scss";
import { CodeBlock } from "./code-block";
import type { HTMLAttributes } from "react";
import clsx from "clsx";

export interface MarkdownProps extends HTMLAttributes<HTMLDivElement> {
	content: string;
}

// TODO, separate the markdown style component from the markdown parser. Will be useful for the design system page
export const Markdown = ({ content, className, ...divProps }: MarkdownProps) => {
	return (
		<div className={clsx("markdown", className)} {...divProps}>
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
			</MarkdownToJsx>
		</div>
	);
};
