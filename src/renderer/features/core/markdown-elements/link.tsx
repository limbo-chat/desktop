import type * as limbo from "@limbo-chat/api";

export const linkElement: limbo.ui.MarkdownElement = {
	element: "a",
	component: (props) => {
		return <a target="_blank" {...props} />;
	},
};
