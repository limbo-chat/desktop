import { Fragment, useMemo } from "react";
import Markdown from "markdown-to-jsx";
import { useCollatedMarkdownComponents } from "../hooks";

export interface MarkdownRendererProps {
	content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
	const collatedMarkdownComponents = useCollatedMarkdownComponents();

	const overrides = useMemo(() => {
		return Object.fromEntries(collatedMarkdownComponents);
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
