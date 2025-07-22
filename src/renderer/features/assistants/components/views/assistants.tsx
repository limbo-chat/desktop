import { useSuspenseQuery } from "@tanstack/react-query";
import { AppIcon } from "../../../../components/app-icon";
import { IconButton } from "../../../../components/icon-button";
import { Tooltip } from "../../../../components/tooltip";
import { View, ViewContent, ViewHeader, ViewHeaderActions } from "../../../../components/view";
import { useMainRouter } from "../../../../lib/trpc";

export const AssistantsView = () => {
	const mainRouter = useMainRouter();
	const getAssistantsQuery = useSuspenseQuery(mainRouter.assistants.getAll.queryOptions());
	const assistants = getAssistantsQuery.data;

	return (
		<View id="assistants">
			<ViewHeader>
				<input type="text" className="assistants-view-search-input" />
				<ViewHeaderActions>
					<Tooltip label="Download assistant">
						<IconButton onClick={() => {}}>
							<AppIcon icon="download" />
						</IconButton>
					</Tooltip>
					<Tooltip label="Create assistant">
						<IconButton onClick={() => {}}>
							<AppIcon icon="add" />
						</IconButton>
					</Tooltip>
				</ViewHeaderActions>
			</ViewHeader>
			<ViewContent>
				{assistants.map((assistant) => (
					<div className="assistant" key={assistant.id}>
						<div className="assistant-name">{assistant.name}</div>
						<p className="assistant-description">{assistant.description}</p>
					</div>
				))}
			</ViewContent>
		</View>
	);
};
