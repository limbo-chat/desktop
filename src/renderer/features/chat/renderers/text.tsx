import type * as limbo from "@limbo/api";

export const TextNodeRenderer = ({ node }: limbo.ui.ChatNodeComponentProps) => {
	return <p>{node.data.content as string}</p>;
};
