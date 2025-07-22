import { useSuspenseQuery } from "@tanstack/react-query";
import { AppIcon } from "../../../../components/app-icon";
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
						<IconButton onClick={() => viewStack.push({ id: "create-assistant" })}>
							<AppIcon icon="add" />
						</IconButton>
					</Tooltip>
				</View.HeaderActions>
			</View.Header>
			<View.Content>
				{assistants.map((assistant) => (
					<div className="assistant" key={assistant.id}>
						<div className="assistant-name">{assistant.name}</div>
						<p className="assistant-description">{assistant.description}</p>
					</div>
				))}
			</View.Content>
		</View.Root>
	);
};
