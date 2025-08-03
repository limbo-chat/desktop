import { useSuspenseQuery } from "@tanstack/react-query";
import { Button } from "../../../../components/button";
import { useMainRouter } from "../../../../lib/trpc";
import { MarkdownContainer } from "../../../markdown/components/markdown-container";
import { MarkdownRenderer } from "../../../markdown/components/markdown-renderer";
import * as View from "../../../view-stack/components/view";
import { useViewStackContext } from "../../../view-stack/hooks";
import type { ViewComponentProps } from "../../../view-stack/types";

export interface ViewAssistantViewData {
	assistantId: string;
}

// funny name
export const ViewAssistantView = ({ view }: ViewComponentProps<ViewAssistantViewData>) => {
	const mainRouter = useMainRouter();
	const viewStack = useViewStackContext();

	const getAssistantQuery = useSuspenseQuery(
		mainRouter.assistants.get.queryOptions({
			id: view.data.assistantId,
		})
	);

	const assistant = getAssistantQuery.data;

	return (
		<View.Root>
			<View.Header>
				<View.HeaderStart>
					<View.BackButton type="button" />
					<View.TitleProps>{assistant.name}</View.TitleProps>
				</View.HeaderStart>
				<View.HeaderActions>
					<Button
						onClick={() => {
							viewStack.push({
								id: "edit-assistant",
								data: {
									assistantId: assistant.id,
								},
							});
						}}
					>
						Edit
					</Button>
				</View.HeaderActions>
			</View.Header>
			<View.Content>
				<MarkdownContainer className="view-assistant-description">
					<MarkdownRenderer content={assistant.description} />
				</MarkdownContainer>
			</View.Content>
		</View.Root>
	);
};
