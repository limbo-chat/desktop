import { useEffect, useMemo, useState } from "react";
import type * as limbo from "@limbo/api";
import { ImageLikeRenderer } from "../../../components/app-icon";
import { parseNamespacedResourceId } from "../../../lib/utils";
import * as QuickPicker from "../../quick-picker/components/primitive";
import * as TreeQuickPicker from "../../quick-picker/components/tree-primitive";
import { useToolList } from "../hooks";

interface ToolGroup {
	id: string;
	name: string;
	tools: limbo.Tool[];
}

export interface ToolPickerProps {
	selectedToolIds: Set<string>;
	onSelectedToolIdsChange: (newSelectedIds: Set<string>) => void;
	onSubmit: () => void;
}

export const ToolPicker = ({
	selectedToolIds,
	onSelectedToolIdsChange,
	onSubmit,
}: ToolPickerProps) => {
	const [focusedId, setFocusedId] = useState<string | null>(null);
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
	const [search, setSearch] = useState("");
	const tools = useToolList();

	const toolGroups = useMemo(() => {
		const groups = new Map<string, ToolGroup>();

		for (const tool of tools) {
			const resourceId = parseNamespacedResourceId(tool.id);

			if (!resourceId) {
				continue;
			}

			const existingGroup = groups.get(resourceId.namespace);

			if (existingGroup) {
				existingGroup.tools.push(tool);
			} else {
				groups.set(resourceId.namespace, {
					id: resourceId.namespace,
					name: resourceId.namespace,
					tools: [tool],
				});
			}
		}

		return groups;
	}, [tools]);

	const nodes = useMemo<TreeQuickPicker.TreeNode[]>(() => {
		const result: TreeQuickPicker.TreeNode[] = [];

		for (const group of toolGroups.values()) {
			result.push({
				type: "group",
				id: group.id,
				title: group.name,
				children: group.tools.map((tool) => ({
					type: "leaf",
					id: tool.id,
					title: tool.id,
					description: tool.description,
					// this isn't possible at the moment because plugins are able to provide a function to render their icon depending on the tool call.
					// that complicates this too much IMO.
					// icon: tool.icon && <ImageLikeRenderer imageLike={tool.icon} />,
				})),
			});
		}

		return result;
	}, [toolGroups]);

	useEffect(() => {
		const newExpandedIds = new Set(expandedIds);

		for (const group of toolGroups.values()) {
			if (!newExpandedIds.has(group.id)) {
				newExpandedIds.add(group.id);
			}
		}

		setExpandedIds(newExpandedIds);
	}, [toolGroups]);

	// const fuse = useMemo(() => {
	// 	return new Fuse([], {
	// 		threshold: 0.3,
	// 		ignoreLocation: true,
	// 		keys: ["id", "name", "description"],
	// 	});
	// }, []);

	return (
		<TreeQuickPicker.Root
			nodes={nodes}
			focusedId={focusedId}
			expandedIds={expandedIds}
			selectedIds={selectedToolIds}
			onFocusedIdChange={setFocusedId}
			onExpandedIdsChange={setExpandedIds}
			onSelectedIdsChange={onSelectedToolIdsChange}
			onSubmit={onSubmit}
		>
			<QuickPicker.Split>
				<QuickPicker.Master>
					<QuickPicker.Header>
						<TreeQuickPicker.Search
							placeholder="Search tools..."
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
					</QuickPicker.Header>
					<TreeQuickPicker.Content>
						<TreeQuickPicker.Tree />
					</TreeQuickPicker.Content>
				</QuickPicker.Master>
				{/* <QuickPicker.Detail>test</QuickPicker.Detail> */}
			</QuickPicker.Split>
		</TreeQuickPicker.Root>
	);
};
