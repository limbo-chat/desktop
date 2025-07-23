import { useSuspenseQuery } from "@tanstack/react-query";
import { AppIcon } from "../../../../components/app-icon";
import { Button } from "../../../../components/button";
import { EmptyState, EmptyStateActions, EmptyStateTitle } from "../../../../components/empty-state";
import { IconButton } from "../../../../components/icon-button";
import { Tooltip } from "../../../../components/tooltip";
import { useMainRouter } from "../../../../lib/trpc";
import * as View from "../../../view-stack/components/view";
import { useViewStackContext } from "../../../view-stack/hooks";

export const AssistantsView = () => {
	const mainRouter = useMainRouter();
	const getAssistantsQuery = useSuspenseQuery(mainRouter.assistants.getAll.queryOptions());
	const assistants = getAssistantsQuery.data;
	const viewStack = useViewStackContext();

	return (
		<View.Root>
			<View.Header>
				<input type="text" className="assistants-view-search-input" />
				<View.HeaderActions>
					<Tooltip label="Download assistant">
						<IconButton onClick={() => {}}>
							<AppIcon icon="download" />
						</IconButton>
					</Tooltip>
					<Tooltip label="Create assistant">
						<IconButton
							onClick={() => viewStack.push({ id: "create-assistant", data: null })}
						>
							<AppIcon icon="add" />
						</IconButton>
					</Tooltip>
				</View.HeaderActions>
			</View.Header>
			<View.Content>
				{assistants.length === 0 && (
					<EmptyState>
						<EmptyStateTitle>No assistants found</EmptyStateTitle>
						<EmptyStateActions>
							<Button
								onClick={() =>
									viewStack.push({ id: "create-assistant", data: null })
								}
							>
								Create assistant
							</Button>
						</EmptyStateActions>
					</EmptyState>
				)}
				{assistants.map((assistant) => (
					<div
						className="assistant"
						key={assistant.id}
						onClick={() =>
							viewStack.push({
								id: "update-assistant",
								data: { assistantId: assistant.id },
							})
						}
					>
						<div className="assistant-name">{assistant.name}</div>
						<p className="assistant-description">{assistant.description}</p>
					</div>
				))}
			</View.Content>
		</View.Root>
	);
};
