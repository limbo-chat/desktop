import type * as limbo from "@limbo/api";

export const inputElement: limbo.ui.MarkdownElement = {
	element: "input",
	component: (props) => {
		return <input disabled {...props} />;
	},
};
