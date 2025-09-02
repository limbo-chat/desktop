import type * as limbo from "@limbo-chat/api";
import { CodeBlock } from "../../../components/code-block";

export const codeElement: limbo.ui.MarkdownElement = {
	element: "code",
	component: (props) => {
		// inline code
		if (!props.className) {
			return <code {...props} />;
		}

		const lang = (props.className as string).split("lang-")[1]!;

		return <CodeBlock lang={lang} content={props.children as string} />;
	},
};
