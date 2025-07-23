import { useSuspenseQuery } from "@tanstack/react-query";
import Fuse from "fuse.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppIcon } from "../../../../components/app-icon";
import { Button } from "../../../../components/button";
import { EmptyState, EmptyStateActions, EmptyStateTitle } from "../../../../components/empty-state";
import { IconButton } from "../../../../components/icon-button";
import { SearchInput } from "../../../../components/search-input";
import { Tooltip } from "../../../../components/tooltip";
import { useMainRouter } from "../../../../lib/trpc";
import * as View from "../../../view-stack/components/view";
import { useViewStackContext } from "../../../view-stack/hooks";

export const AssistantsView = () => {
	const mainRouter = useMainRouter();
	const getAssistantsQuery = useSuspenseQuery(mainRouter.assistants.getAll.queryOptions());
	const assistants = getAssistantsQuery.data;
	const viewStack = useViewStackContext();
	const [search, setSearch] = useState("");
	const searchInputRef = useRef<HTMLInputElement>(null);

	const fuse = useMemo(() => {
		return new Fuse(assistants, {
			threshold: 0.3,
			ignoreLocation: true,
			keys: ["id", "name", "description"],
		});
	}, [assistants]);

	const filteredAssistants = useMemo(() => {
		if (search.length === 0) {
			return assistants;
		}

		return fuse.search(search).map((item) => item.item);
	}, [fuse, search, assistants]);

	useEffect(() => {
		// this seems to fix the issue of the input not focusing on mount
		// not sure why I have to do this, may be due to being rendered inside radix tabs
		requestAnimationFrame(() => {
			if (searchInputRef.current) {
				searchInputRef.current.focus();
			}
		});
	}, []);

	return (
		<View.Root>
			<View.Header>
				<SearchInput
					placeholder="Search assistants..."
					value={search}
					onChange={setSearch}
					ref={searchInputRef}
				/>
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
				<div className="assistant-list">
					{filteredAssistants.map((assistant) => (
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
				</div>
			</View.Content>
		</View.Root>
	);
};
