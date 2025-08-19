import type * as limbo from "@limbo/api";

const TextNodeRenderer = ({ node }: limbo.ui.ChatNodeComponentProps) => {
	return <p>{node.data.content as string}</p>;
};

export const textNode: limbo.ui.ChatNode = {
	id: "text",
	component: TextNodeRenderer,
};
