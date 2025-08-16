import { useEffect, useMemo, useState } from "react";
import type * as limbo from "@limbo/api";
import Fuse from "fuse.js";
import { buildNamespacedResourceId, parseNamespacedResourceId } from "../../../lib/utils";
import { usePlugins } from "../../plugins/hooks/core";
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
	const plugins = usePlugins();
	const tools = useToolList();

	const [focusedId, setFocusedId] = useState<string | null>(null);
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
	const [search, setSearch] = useState("");

	const filteredTools = useMemo(() => {
		if (!search) {
			return tools;
		}

		const fuse = new Fuse(tools, {
			threshold: 0.3,
			ignoreLocation: true,
			keys: ["id"],
		});

		return fuse.search(search).map((item) => item.item);
	}, [tools, search]);

	const toolGroups = useMemo(() => {
		const groups = new Map<string, ToolGroup>();

		for (const tool of filteredTools) {
			const resourceId = parseNamespacedResourceId(tool.id)!;
			const plugin = plugins.get(resourceId.namespace);

			if (!plugin) {
				continue;
			}

			const groupId = buildNamespacedResourceId("plugin", plugin.manifest.id);
			const existingGroup = groups.get(resourceId.namespace);

			if (existingGroup) {
				existingGroup.tools.push(tool);
			} else {
				const newGroup: ToolGroup = {
					id: groupId,
					name: plugin.manifest.name,
					tools: [tool],
				};

				groups.set(resourceId.namespace, newGroup);
			}
		}

		return [...groups.values()];
	}, [plugins, filteredTools]);

	const items = useMemo<TreeQuickPicker.TreeItem[]>(() => {
		const result: TreeQuickPicker.TreeItem[] = [];

		for (const group of toolGroups) {
			result.push({
				type: "group",
				id: group.id,
				title: group.name,
				children: group.tools.map((tool) => {
					// should never fail
					const resourceId = parseNamespacedResourceId(tool.id)!;

					return {
						type: "leaf",
						id: tool.id,
						title: resourceId.resource,
						description: tool.description,
						// this isn't possible at the moment because plugins are able to provide a function to render their icon depending on the tool call.
						// that complicates this too much IMO.
						// icon: tool.icon && <ImageLikeRenderer imageLike={tool.icon} />,
					};
				}),
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

	return (
		<TreeQuickPicker.Root
			items={items}
			focusedId={focusedId}
			expandedIds={expandedIds}
			selectedIds={selectedToolIds}
			onFocusedIdChange={setFocusedId}
			onExpandedIdsChange={setExpandedIds}
			onSelectedIdsChange={onSelectedToolIdsChange}
			onSubmit={onSubmit}
		>
			<QuickPicker.Header>
				<TreeQuickPicker.MasterCheckbox />
				<QuickPicker.Search>
					<TreeQuickPicker.SearchInput
						placeholder="Search tools..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<QuickPicker.SearchAccessories>
						<TreeQuickPicker.SelectedCountBadge />
					</QuickPicker.SearchAccessories>
				</QuickPicker.Search>
				<QuickPicker.PrimaryAction>
					<TreeQuickPicker.SubmitButton>Ok</TreeQuickPicker.SubmitButton>
				</QuickPicker.PrimaryAction>
			</QuickPicker.Header>
			<TreeQuickPicker.Content>
				<TreeQuickPicker.Tree />
			</TreeQuickPicker.Content>
		</TreeQuickPicker.Root>
	);
};
