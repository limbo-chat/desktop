import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { AppIcon } from "../../../components/app-icon";
import { Checkbox } from "../../../components/checkbox";
import { IconButton } from "../../../components/icon-button";
import * as QuickPicker from "./primitive";

export interface BaseTreeNode {
	id: string;
	title: string;
	icon?: React.ReactNode;
	description?: string;
}

export interface LeafTreeNode extends BaseTreeNode {
	type: "leaf";
}

export interface GroupTreeNode extends BaseTreeNode {
	type: "group";
	children: TreeNode[];
}

export type TreeNode = LeafTreeNode | GroupTreeNode;

function isLeafNodeSelected(node: LeafTreeNode, selectedIds: Set<string>): boolean {
	return selectedIds.has(node.id);
}

function isGroupNodeSelected(node: GroupTreeNode, selectedIds: Set<string>): boolean {
	return node.children.every((child) => {
		if (child.type === "leaf") {
			return isLeafNodeSelected(child, selectedIds);
		} else {
			return isGroupNodeSelected(child, selectedIds);
		}
	});
}

function isNodeSelected(node: TreeNode, selectedIds: Set<string>): boolean {
	if (node.type === "leaf") {
		return isLeafNodeSelected(node, selectedIds);
	} else {
		return isGroupNodeSelected(node, selectedIds);
	}
}

function filterVisibleNodes(nodes: TreeNode[], expandedIds: Set<string>): TreeNode[] {
	return nodes.map((node) => {
		if (node.type === "leaf") {
			return node;
		} else {
			if (expandedIds.has(node.id)) {
				return {
					...node,
					children: filterVisibleNodes(node.children, expandedIds),
				};
			}
		}

		return { ...node, children: [] };
	});
}

interface FlattenedTreeNode {
	node: TreeNode;
	parent: TreeNode | null;
}

function flattenTreeNodes(nodes: TreeNode[]): FlattenedTreeNode[] {
	const result: FlattenedTreeNode[] = [];

	function traverse(node: TreeNode, parent: TreeNode | null): void {
		result.push({ node, parent });

		if (node.type === "group") {
			for (const child of node.children) {
				traverse(child, node);
			}
		}
	}

	for (const node of nodes) {
		traverse(node, null);
	}

	return result;
}

function collectLeafNodes(node: GroupTreeNode): TreeNode[] {
	const collectedChildNodes: TreeNode[] = [];

	for (const child of node.children) {
		if (child.type === "leaf") {
			collectedChildNodes.push(child);
		} else {
			collectedChildNodes.push(...collectLeafNodes(child));
		}
	}

	return collectedChildNodes;
}

interface TreeQuickPickerContext {
	nodes: TreeNode[];
	searchRef: React.Ref<HTMLInputElement>;
	treeRef: React.Ref<HTMLUListElement>;
	contentRef: React.Ref<HTMLDivElement>;
	focusedId: string | null;
	expandedIds: Set<string>;
	selectedIds: Set<string>;
	registerItemElement: (itemId: string, element: HTMLElement) => void;
	unregisterItemElement: (itemId: string) => void;
	expandNode: (node: GroupTreeNode) => void;
	collapseNode: (node: GroupTreeNode) => void;
	toggleNodeExpanded: (node: GroupTreeNode) => void;
	selectNode: (node: TreeNode) => void;
	unselectNode: (node: TreeNode) => void;
	toggleNodeSelected: (node: TreeNode) => void;
}

const treeQuickPickerContext = createContext<TreeQuickPickerContext | null>(null);

export const useTreeQuickPickerContext = () => {
	const ctx = useContext(treeQuickPickerContext);

	if (!ctx) {
		throw new Error("useTreeQuickPickerContext must be used within a TreeQuickPicker");
	}

	return ctx;
};

export interface RootProps extends QuickPicker.RootProps {
	nodes: TreeNode[];
	focusedId: string | null;
	expandedIds: Set<string>;
	selectedIds: Set<string>;
	onFocusedIdChange: (focusedId: string | null) => void;
	onExpandedIdsChange: (newExpandedIds: Set<string>) => void;
	onSelectedIdsChange: (newExpandedIds: Set<string>) => void;
	onSubmit: () => void;
}

export const Root = ({
	nodes,
	focusedId,
	expandedIds,
	selectedIds,
	onFocusedIdChange,
	onExpandedIdsChange,
	onSelectedIdsChange,
	onSubmit,
	...props
}: RootProps) => {
	const treeRef = useRef<HTMLUListElement>(null);
	const searchRef = useRef<HTMLInputElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const itemRefs = useMemo<Map<string, HTMLElement | null>>(() => new Map(), []);

	const scrollToTopOfContent = () => {
		contentRef.current?.scrollTo({ top: 0 });
	};

	const scrollToItem = (itemId: string) => {
		const itemElement = itemRefs.get(itemId);

		if (itemElement) {
			itemElement.scrollIntoView({
				block: "nearest",
			});
		}
	};

	const registerItemElement = (itemId: string, element: HTMLElement) => {
		itemRefs.set(itemId, element);
	};

	const unregisterItemElement = (itemId: string) => {
		itemRefs.delete(itemId);
	};

	const focusTree = () => {
		treeRef.current?.focus();
	};

	const focusSearch = () => {
		searchRef.current?.focus();
	};

	const blurSearch = () => {
		searchRef.current?.blur();
	};

	const flattenedNodes = useMemo(() => {
		return flattenTreeNodes(nodes);
	}, [nodes]);

	const visibleNodes = useMemo(() => {
		return filterVisibleNodes(nodes, expandedIds);
	}, [nodes, expandedIds]);

	const flattenedVisibleNodes = useMemo(() => {
		return flattenTreeNodes(visibleNodes);
	}, [visibleNodes]);

	const focusedNode = useMemo(() => {
		if (focusedId === null) {
			return null;
		}

		return flattenedNodes.find((node) => node.node.id === focusedId) ?? null;
	}, [flattenedNodes, focusedId]);

	const moveFocusUp = () => {
		if (flattenedVisibleNodes.length === 0) {
			return;
		}

		if (focusedId === null) {
			return;
		}

		const focusedNodeIdx = flattenedVisibleNodes.findIndex(
			(node) => node.node.id === focusedId
		);

		if (focusedNodeIdx === -1) {
			return;
		}

		let nextNodeId: string | null;

		if (focusedNodeIdx === 0) {
			nextNodeId = null;

			focusSearch();
		} else {
			// move to previous node
			nextNodeId = flattenedVisibleNodes[focusedNodeIdx - 1]!.node.id;

			blurSearch();
			focusTree();
		}

		onFocusedIdChange(nextNodeId);
	};

	const moveFocusDown = () => {
		if (flattenedVisibleNodes.length === 0) {
			return;
		}

		const focusedNodeIdx = flattenedVisibleNodes.findIndex(
			(node) => node.node.id === focusedId
		);

		const nextNodeIdx = focusedNodeIdx + 1;

		let nextNodeId: string | null;

		if (nextNodeIdx >= flattenedVisibleNodes.length) {
			// at last node, wrap to search input
			nextNodeId = null;

			focusSearch();
		} else {
			// move to next node
			nextNodeId = flattenedVisibleNodes[focusedNodeIdx + 1]!.node.id;

			blurSearch();
			focusTree();
		}

		onFocusedIdChange(nextNodeId);
	};

	const expandNode = (node: GroupTreeNode) => {
		if (expandedIds.has(node.id)) {
			const firstChild = node.children[0];

			if (firstChild) {
				onFocusedIdChange(firstChild.id);
			}

			return;
		}

		const newExpandedIds = new Set(expandedIds);

		newExpandedIds.add(node.id);

		onExpandedIdsChange(newExpandedIds);
	};

	const collapseNode = (node: GroupTreeNode) => {
		if (!expandedIds.has(node.id)) {
			// the group is already collapsed
			return;
		}

		const newExpandedIds = new Set(expandedIds);

		newExpandedIds.delete(node.id);

		onExpandedIdsChange(newExpandedIds);
		onFocusedIdChange(node.id);
	};

	const toggleNodeExpanded = (node: GroupTreeNode) => {
		if (expandedIds.has(node.id)) {
			collapseNode(node);
		} else {
			expandNode(node);
		}
	};

	const expandFocused = () => {
		if (!focusedNode) {
			return;
		}

		if (focusedNode.node.type !== "group") {
			return;
		}

		expandNode(focusedNode.node);
	};

	const collapseFocused = () => {
		if (!focusedNode) {
			return;
		}

		if (focusedNode.node.type === "leaf") {
			if (focusedNode.parent) {
				onFocusedIdChange(focusedNode.parent.id);
			}
		} else {
			collapseNode(focusedNode.node);
		}
	};

	const selectNode = (node: TreeNode) => {
		const newSelectedIds = new Set(selectedIds);

		let nodesToSelect;

		if (node.type === "leaf") {
			nodesToSelect = [node];
		} else {
			nodesToSelect = collectLeafNodes(node);
		}

		for (const nodeToSelect of nodesToSelect) {
			newSelectedIds.add(nodeToSelect.id);
		}

		onSelectedIdsChange(newSelectedIds);
	};

	const unselectNode = (node: TreeNode) => {
		const newSelectedIds = new Set(selectedIds);

		let nodesToUnselect;

		if (node.type === "leaf") {
			nodesToUnselect = [node];
		} else {
			nodesToUnselect = collectLeafNodes(node);
		}

		for (const nodeToUnselectSelect of nodesToUnselect) {
			newSelectedIds.delete(nodeToUnselectSelect.id);
		}

		onSelectedIdsChange(newSelectedIds);
	};

	const toggleNodeSelected = (node: TreeNode) => {
		const isSelected = isNodeSelected(node, selectedIds);

		if (isSelected) {
			unselectNode(node);
		} else {
			selectNode(node);
		}
	};

	const toggleFocusedSelected = () => {
		if (!focusedNode) {
			return;
		}

		toggleNodeSelected(focusedNode.node);
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.target !== searchRef.current) {
			e.preventDefault();
		}

		switch (e.key) {
			case "ArrowUp":
				moveFocusUp();

				break;
			case "ArrowDown":
				moveFocusDown();

				break;
			case "ArrowRight":
				if (e.target !== searchRef.current) {
					expandFocused();
				}

				break;
			case "ArrowLeft":
				if (e.target !== searchRef.current) {
					collapseFocused();
				}

				break;
			case " ":
				if (e.target !== searchRef.current) {
					toggleFocusedSelected();
				}

				break;
			case "Enter":
				onSubmit();
				break;
		}
	};

	useEffect(() => {
		if (focusedId) {
			scrollToItem(focusedId);
		} else {
			scrollToTopOfContent();
		}
	}, [focusedId]);

	return (
		<treeQuickPickerContext.Provider
			value={{
				nodes,
				treeRef,
				searchRef,
				contentRef,
				focusedId,
				expandedIds,
				selectedIds,
				selectNode,
				unselectNode,
				toggleNodeSelected,
				expandNode,
				collapseNode,
				toggleNodeExpanded,
				registerItemElement,
				unregisterItemElement,
			}}
		>
			<QuickPicker.Root onKeyDown={onKeyDown} {...props} />
		</treeQuickPickerContext.Provider>
	);
};

export interface SearchProps extends QuickPicker.SearchProps {}

export const Search = (props: SearchProps) => {
	const { searchRef } = useTreeQuickPickerContext();

	return <QuickPicker.Search ref={searchRef} {...props} />;
};

export interface ContentProps extends QuickPicker.ContentProps {}

export const Content = (props: ContentProps) => {
	const { contentRef } = useTreeQuickPickerContext();

	return <QuickPicker.Content ref={contentRef} {...props} />;
};

interface TreeItemProps {
	node: TreeNode;
	depth: number;
}

const TreeItem = ({ node, depth }: TreeItemProps) => {
	const {
		focusedId,
		expandedIds,
		selectedIds,
		toggleNodeExpanded,
		toggleNodeSelected,
		registerItemElement,
		unregisterItemElement,
	} = useTreeQuickPickerContext();

	const ref = useRef<HTMLLIElement>(null);
	const isFocused = focusedId === node.id;
	const isExpanded = expandedIds.has(node.id);

	const leafNodes = useMemo(() => {
		if (node.type === "leaf") {
			return [];
		}

		return collectLeafNodes(node);
	}, [node]);

	const isSelected = useMemo(() => {
		if (node.type === "leaf") {
			return selectedIds.has(node.id);
		}

		return leafNodes.every((leaf) => selectedIds.has(leaf.id));
	}, [node, leafNodes, selectedIds]);

	const isIndeterminate = useMemo(() => {
		const someSelected = leafNodes.some((leaf) => selectedIds.has(leaf.id));
		const someUnselected = leafNodes.some((leaf) => !selectedIds.has(leaf.id));

		return someSelected && someUnselected;
	}, [leafNodes, selectedIds]);

	const onSelect = () => {
		toggleNodeSelected(node);
	};

	const onExpandClick = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (node.type === "group") {
			toggleNodeExpanded(node);
		}
	};

	useEffect(() => {
		if (!ref.current) {
			// this should't happen
			return;
		}

		registerItemElement(node.id, ref.current);

		return () => {
			unregisterItemElement(node.id);
		};
	}, []);

	return (
		<>
			<li
				ref={ref}
				id={`qp-tree-item-${node.id}`}
				className="quick-picker-tree-item"
				role="checkbox"
				data-type={node.type}
				data-is-expanded={isExpanded}
				data-is-focused={isFocused}
				data-is-selected={isSelected}
				data-depth={depth}
				aria-level={depth + 1}
				aria-selected={isSelected}
				onClick={onSelect}
				style={{
					// @ts-expect-error
					"--tree-depth": depth,
				}}
			>
				{node.type === "group" && (
					<IconButton
						className="quick-picker-tree-item-collapse-button"
						onClick={onExpandClick}
					>
						{isExpanded ? <AppIcon icon="collapse" /> : <AppIcon icon="expand" />}
					</IconButton>
				)}
				<Checkbox
					className="quick-picker-tree-item-checkbox"
					checked={isIndeterminate ? "indeterminate" : isSelected}
				/>
				{node.icon && <div className="quick-picker-tree-item-icon">{node.icon}</div>}
				<div className="quick-picker-tree-item-title">{node.title}</div>
				<div className="quick-picker-tree-item-description">{node.description}</div>
			</li>
			{node.type == "group" &&
				isExpanded &&
				node.children.map((child) => (
					<TreeItem node={child} depth={depth + 1} key={child.id} />
				))}
		</>
	);
};

export const Tree = () => {
	const { treeRef, nodes, focusedId } = useTreeQuickPickerContext();

	return (
		<ul
			className="quick-picker-tree"
			role="tree"
			tabIndex={-1}
			aria-activedescendant={focusedId ? `qp-tree-item-${focusedId}` : undefined}
			ref={treeRef}
		>
			{nodes.map((node) => {
				return <TreeItem depth={0} node={node} key={node.id} />;
			})}
		</ul>
	);
};
