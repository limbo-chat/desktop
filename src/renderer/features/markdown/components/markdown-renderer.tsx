import { Fragment, useMemo } from "react";
import Markdown, { type MarkdownToJSX } from "markdown-to-jsx";
import { CodeBlock } from "../../markdown/components/code-block";
import { useCollatedMarkdownComponents } from "../hooks";

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
	const collatedMarkdownComponents = useCollatedMarkdownComponents();

	const overrides = useMemo(() => {
		return {
			...coreOverrides,
			...Object.fromEntries(collatedMarkdownComponents),
		};
	}, [collatedMarkdownComponents]);

	return (
		<Markdown
			options={{
				overrides,
				wrapper: Fragment,
			}}
		>
			{content}
		</Markdown>
	);
};
