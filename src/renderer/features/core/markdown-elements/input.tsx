import type * as limbo from "@limbo-chat/api";

export const inputElement: limbo.ui.MarkdownElement = {
	element: "input",
	component: (props) => {
		return <input disabled {...props} />;
	},
};
