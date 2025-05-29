import MarkdownToJsx from "markdown-to-jsx";
import type * as limbo from "limbo";
import { CodeBlock } from "../../markdown/components/code-block";
import { Markdown } from "../../markdown/components/markdown";

export interface MarkdownNodeRendererProps {
	node: limbo.MarkdownChatMessageNode;
}

export const MarkdownNodeRenderer = ({ node }: MarkdownNodeRendererProps) => {
	return (
		<div className="node" data-type={node.type}>
			<Markdown>
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
							code: (props) => {
								// inline code
								if (!props.className) {
									return <code {...props} />;
								}

								const lang = props.className.split("lang-")[1];

								return <CodeBlock lang={lang} content={props.children} />;
							},
						},
					}}
				>
					{node.data.content}
				</MarkdownToJsx>
			</Markdown>
		</div>
	);
};
