import MarkdownToJsx from "markdown-to-jsx";
import "./markdown.scss";
import { CodeBlock } from "./code-block";

export interface MarkdownProps {
	content: string;
}

export const Markdown = ({ content }: MarkdownProps) => {
	return (
		<div className="md">
			<MarkdownToJsx
				options={{
					overrides: {
						a: {
							component: "a",
							props: {
								target: "_blank",
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
