import Markdown, { type MarkdownToJSX } from "markdown-to-jsx";
import { CodeBlock } from "../../markdown/components/code-block";

const coreOverrides: MarkdownToJSX.Overrides = {
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
} as const;

export interface MarkdownRendererProps {
	content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
	return (
		<Markdown
			options={{
				overrides: coreOverrides,
			}}
		>
			{content}
		</Markdown>
	);
};
