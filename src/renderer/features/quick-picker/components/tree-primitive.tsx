import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { AppIcon } from "../../../components/app-icon";
import { Badge, type BadgeProps } from "../../../components/badge";
import { Button, type ButtonProps } from "../../../components/button";
import { Checkbox, type CheckboxProps } from "../../../components/checkbox";
import { IconButton } from "../../../components/icon-button";
import * as QuickPicker from "./primitive";

export interface LeafTreeNode {
	id: string;
	type: "leaf";
}

export interface GroupTreeNode {
	id: string;
	type: "group";
	children: TreeNode[];
}

export type TreeNode = LeafTreeNode | GroupTreeNode;

export interface BaseTreeItem {
	title: string;
	description?: string;
	icon?: React.ReactNode;
}

export interface LeafTreeItem extends BaseTreeItem {
	id: string;
	type: "leaf";
}

export interface GroupTreeItem extends BaseTreeItem {
	id: string;
	type: "group";
	children: TreeItem[];
}

export type TreeItem = LeafTreeItem | GroupTreeItem;

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

type NodeCheckboxState = "selected" | "unselected" | "indeterminate";

function getNodeCheckboxState(node: TreeNode, selectedIds: Set<string>): NodeCheckboxState {
	if (node.type === "leaf") {
		return selectedIds.has(node.id) ? "selected" : "unselected";
	}

	let hasSelected = false;
	let hasUnselected = false;

	for (const child of node.children) {
		const childState = getNodeCheckboxState(child, selectedIds);

		if (childState === "selected") {
			hasSelected = true;
		} else if (childState === "unselected") {
			hasUnselected = true;
		}

		if (hasSelected && hasUnselected) {
			return "indeterminate";
		}
	}

	return hasSelected ? "selected" : "unselected";
}

function filterVisibleItems(items: TreeItem[], expandedIds: Set<string>): TreeItem[] {
	return items.map((item) => {
		if (item.type === "leaf") {
			return item;
		} else {
			if (expandedIds.has(item.id)) {
				return {
					...item,
					children: filterVisibleItems(item.children, expandedIds),
				};
			}
		}

		return { ...item, children: [] };
	});
}

interface FlattenedTreeItem {
	item: TreeItem;
	parent: GroupTreeItem | null;
}

function flattenTreeItems(nodes: TreeItem[]): FlattenedTreeItem[] {
	const result: FlattenedTreeItem[] = [];

	function traverse(item: TreeItem, parent: GroupTreeItem | null): void {
		result.push({ item, parent });

		if (item.type === "group") {
			for (const child of item.children) {
				traverse(child, item);
			}
		}
	}

	for (const node of nodes) {
		traverse(node, null);
	}

	return result;
}

interface TreeQuickPickerContext {
	items: TreeItem[];
	searchInputRef: React.Ref<HTMLInputElement>;
	treeRef: React.Ref<HTMLUListElement>;
	contentRef: React.Ref<HTMLDivElement>;
	focusedId: string | null;
	expandedIds: Set<string>;
	selectedIds: Set<string>;
	submit: () => void;
	registerItemElement: (itemId: string, element: HTMLElement) => void;
	unregisterItemElement: (itemId: string) => void;
	expandItem: (item: GroupTreeItem) => void;
	collapseItem: (item: GroupTreeItem) => void;
	toggleItemExpanded: (item: GroupTreeItem) => void;
	selectItem: (item: TreeItem) => void;
	unselectItem: (item: TreeItem) => void;
	toggleItemSelected: (item: TreeItem) => void;
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
	items: TreeItem[];
	focusedId: string | null;
	expandedIds: Set<string>;
	selectedIds: Set<string>;
	onFocusedIdChange: (focusedId: string | null) => void;
	onExpandedIdsChange: (newExpandedIds: Set<string>) => void;
	onSelectedIdsChange: (newExpandedIds: Set<string>) => void;
	onSubmit: () => void;
}

export const Root = ({
	items,
	focusedId,
	expandedIds,
	selectedIds,
	onFocusedIdChange,
	onExpandedIdsChange,
	onSelectedIdsChange,
	onSubmit,
	...props
}: RootProps) => {
	const searchInputRef = useRef<HTMLInputElement>(null);
	const treeRef = useRef<HTMLUListElement>(null);
	const contentRef = useRef<HTMLDivElement>(null);
	const itemRefs = useMemo<Map<string, HTMLElement | null>>(() => new Map(), []);

	const submit = () => {
		onSubmit();
	};

	const scrollToTopOfContent = () => {
		contentRef.current?.scrollTo({ top: 0 });
	};

	const scrollToItem = (itemId: string) => {
		const itemElement = itemRefs.get(itemId);

		if (itemElement) {
			itemElement.scrollIntoView({
				block: "nearest",
				behavior: "auto",
			});
		}
	};

	const focusItem = (itemId: string) => {
		blurSearch();
		focusTree();
		scrollToItem(itemId);
		onFocusedIdChange(itemId);
	};

	const clearFocusedItem = () => {
		scrollToTopOfContent();
		focusSearch();
		onFocusedIdChange(null);
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
		searchInputRef.current?.focus();
	};

	const blurSearch = () => {
		searchInputRef.current?.blur();
	};

	const flattenedItems = useMemo(() => {
		return flattenTreeItems(items);
	}, [items]);

	const visibleItems = useMemo(() => {
		return filterVisibleItems(items, expandedIds);
	}, [items, expandedIds]);

	const flattenedVisibleItems = useMemo(() => {
		return flattenTreeItems(visibleItems);
	}, [visibleItems]);

	const focusedItem = useMemo(() => {
		if (focusedId === null) {
			return null;
		}

		return flattenedItems.find((item) => item.item.id === focusedId) ?? null;
	}, [flattenedItems, focusedId]);

	const moveFocusUp = () => {
		if (flattenedVisibleItems.length === 0) {
			return;
		}

		if (focusedId === null) {
			return;
		}

		const focusedItemIdx = flattenedVisibleItems.findIndex(
			(item) => item.item.id === focusedId
		);

		if (focusedItemIdx === -1) {
			return;
		}

		let nextItemId: string | null;

		if (focusedItemIdx === 0) {
			nextItemId = null;
		} else {
			// move to previous item
			nextItemId = flattenedVisibleItems[focusedItemIdx - 1]!.item.id;
		}

		if (nextItemId) {
			focusItem(nextItemId);
		} else {
			clearFocusedItem();
		}
	};

	const moveFocusDown = () => {
		if (flattenedVisibleItems.length === 0) {
			return;
		}

		const focusedItemIdx = flattenedVisibleItems.findIndex(
			(item) => item.item.id === focusedId
		);

		const nextItemIdx = focusedItemIdx + 1;

		let nextItemId: string | null;

		if (nextItemIdx >= flattenedVisibleItems.length) {
			// at last item, wrap to search input
			nextItemId = null;
		} else {
			// move to next item
			nextItemId = flattenedVisibleItems[focusedItemIdx + 1]!.item.id;
		}

		if (nextItemId) {
			focusItem(nextItemId);
		} else {
			clearFocusedItem();
		}
	};

	const expandItem = (item: GroupTreeItem) => {
		if (expandedIds.has(item.id)) {
			const firstChild = item.children[0];

			if (firstChild) {
				onFocusedIdChange(firstChild.id);
			}

			return;
		}

		const newExpandedIds = new Set(expandedIds);

		newExpandedIds.add(item.id);

		onExpandedIdsChange(newExpandedIds);
	};

	const collapseItem = (item: GroupTreeItem) => {
		if (!expandedIds.has(item.id)) {
			// the group is already collapsed
			return;
		}

		const newExpandedIds = new Set(expandedIds);

		newExpandedIds.delete(item.id);

		onExpandedIdsChange(newExpandedIds);
		onFocusedIdChange(item.id);
	};

	const toggleItemExpanded = (item: GroupTreeItem) => {
		if (expandedIds.has(item.id)) {
			collapseItem(item);
		} else {
			expandItem(item);
		}
	};

	const expandFocused = () => {
		if (!focusedItem) {
			return;
		}

		if (focusedItem.item.type !== "group") {
			return;
		}

		expandItem(focusedItem.item);
	};

	const collapseFocused = () => {
		if (!focusedItem) {
			return;
		}

		if (focusedItem.item.type === "leaf") {
			if (focusedItem.parent) {
				onFocusedIdChange(focusedItem.parent.id);
			}
		} else {
			collapseItem(focusedItem.item);
		}
	};

	const selectItem = (item: TreeItem) => {
		const newSelectedIds = new Set(selectedIds);

		let itemsToSelect;

		if (item.type === "leaf") {
			itemsToSelect = [item];
		} else {
			itemsToSelect = collectLeafNodes(item);
		}

		for (const itemToSelect of itemsToSelect) {
			newSelectedIds.add(itemToSelect.id);
		}

		onSelectedIdsChange(newSelectedIds);
	};

	const unselectItem = (item: TreeItem) => {
		const newSelectedIds = new Set(selectedIds);

		let itemsToUnselect;

		if (item.type === "leaf") {
			itemsToUnselect = [item];
		} else {
			itemsToUnselect = collectLeafNodes(item);
		}

		for (const itemToUnselect of itemsToUnselect) {
			newSelectedIds.delete(itemToUnselect.id);
		}

		onSelectedIdsChange(newSelectedIds);
	};

	const toggleItemSelected = (item: TreeItem) => {
		const isSelected = isNodeSelected(item, selectedIds);

		if (isSelected) {
			unselectItem(item);
		} else {
			selectItem(item);
		}
	};

	const toggleFocusedSelected = () => {
		if (!focusedItem) {
			return;
		}

		toggleItemSelected(focusedItem.item);
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		switch (e.key) {
			case "ArrowUp":
				e.preventDefault();

				moveFocusUp();

				break;
			case "ArrowDown":
				e.preventDefault();

				moveFocusDown();

				break;
			case "ArrowRight":
				if (e.target !== searchInputRef.current) {
					expandFocused();
				}

				break;
			case "ArrowLeft":
				if (e.target !== searchInputRef.current) {
					collapseFocused();
				}

				break;
			case " ":
				if (e.target !== searchInputRef.current) {
					toggleFocusedSelected();
				}

				break;
			case "Enter":
				onSubmit();
				break;
		}
	};

	return (
		<treeQuickPickerContext.Provider
			value={{
				items,
				treeRef,
				searchInputRef,
				contentRef,
				focusedId,
				expandedIds,
				selectedIds,
				submit,
				selectItem,
				unselectItem,
				toggleItemSelected,
				expandItem,
				collapseItem,
				toggleItemExpanded,
				registerItemElement,
				unregisterItemElement,
			}}
		>
			<QuickPicker.Root onKeyDown={onKeyDown} {...props} />
		</treeQuickPickerContext.Provider>
	);
};

export interface SearchInputProps extends QuickPicker.SearchInputProps {}

export const SearchInput = (props: SearchInputProps) => {
	const { searchInputRef } = useTreeQuickPickerContext();

	return <QuickPicker.SearchInput ref={searchInputRef} {...props} />;
};

export interface ContentProps extends QuickPicker.ContentProps {}

export const Content = (props: ContentProps) => {
	const { contentRef } = useTreeQuickPickerContext();

	return <QuickPicker.Content ref={contentRef} {...props} />;
};

interface TreeItemProps {
	item: TreeItem;
	depth: number;
}

const TreeItem = ({ item, depth }: TreeItemProps) => {
	const {
		focusedId,
		expandedIds,
		selectedIds,
		toggleItemExpanded,
		toggleItemSelected,
		registerItemElement,
		unregisterItemElement,
	} = useTreeQuickPickerContext();

	const ref = useRef<HTMLLIElement>(null);
	const isFocused = focusedId === item.id;
	const isExpanded = expandedIds.has(item.id);

	const checkboxState = useMemo(() => {
		return getNodeCheckboxState(item, selectedIds);
	}, [item, selectedIds]);

	const isSelected = checkboxState === "selected";

	const onSelect = () => {
		toggleItemSelected(item);
	};

	const onExpandClick = (e: React.MouseEvent) => {
		e.stopPropagation();

		if (item.type === "group") {
			toggleItemExpanded(item);
		}
	};

	useEffect(() => {
		if (!ref.current) {
			// this should't happen
			return;
		}

		registerItemElement(item.id, ref.current);

		return () => {
			unregisterItemElement(item.id);
		};
	}, []);

	return (
		<>
			<li
				ref={ref}
				id={`qp-tree-item-${item.id}`}
				className="quick-picker-tree-item"
				role="checkbox"
				data-type={item.type}
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
				{item.type === "group" && (
					<IconButton
						className="quick-picker-tree-item-collapse-button"
						aria-label={isExpanded ? "Collapse group" : "Expand group"}
						onClick={onExpandClick}
					>
						{isExpanded ? <AppIcon icon="collapse" /> : <AppIcon icon="expand" />}
					</IconButton>
				)}
				<Checkbox
					className="quick-picker-tree-item-checkbox"
					checked={checkboxState === "indeterminate" ? "indeterminate" : isSelected}
				/>
				{item.icon && <div className="quick-picker-tree-item-icon">{item.icon}</div>}
				<div className="quick-picker-tree-item-title">{item.title}</div>
				<div className="quick-picker-tree-item-description">{item.description}</div>
			</li>
			{item.type == "group" &&
				isExpanded &&
				item.children.map((child) => (
					<TreeItem item={child} depth={depth + 1} key={child.id} />
				))}
		</>
	);
};

export const Tree = () => {
	const { treeRef, items, focusedId } = useTreeQuickPickerContext();

	return (
		<ul
			className="quick-picker-tree"
			role="tree"
			tabIndex={-1}
			aria-activedescendant={focusedId ? `qp-tree-item-${focusedId}` : undefined}
			ref={treeRef}
		>
			{items.map((item) => {
				return <TreeItem item={item} depth={0} key={item.id} />;
			})}
		</ul>
	);
};

// misc

export const MasterCheckbox = ({ className, ...props }: CheckboxProps) => {
	const { items, selectedIds, selectItem, unselectItem } = useTreeQuickPickerContext();

	const rootGroup = useMemo<GroupTreeNode>(() => {
		return { id: "root", type: "group", children: items };
	}, [items]);

	const checkboxState = useMemo(() => {
		const rootGroup: GroupTreeNode = {
			id: "root",
			type: "group",
			children: items,
		};

		return getNodeCheckboxState(rootGroup, selectedIds);
	}, [items, selectedIds]);

	const selectAll = () => {
		// @ts-expect-error type mismatch but will work. Ideally fix type mismatch later
		selectItem(rootGroup);
	};

	const unselectAll = () => {
		// @ts-expect-error same as above
		unselectItem(rootGroup);
	};

	const toggleAllSelected = () => {
		if (checkboxState === "selected") {
			unselectAll();
		} else {
			selectAll();
		}
	};

	return (
		<Checkbox
			className={clsx("quick-picker-tree-master-checkbox", className)}
			checked={
				checkboxState === "indeterminate" ? "indeterminate" : checkboxState === "selected"
			}
			onClick={toggleAllSelected}
			{...props}
		/>
	);
};

export const SubmitButton = ({ className, ...props }: ButtonProps) => {
	const { submit } = useTreeQuickPickerContext();

	return (
		<Button
			className={clsx("quick-picker-tree-submit-button", className)}
			onClick={submit}
			{...props}
		/>
	);
};

export const SelectedCountBadge = ({ className, ...props }: BadgeProps) => {
	const { selectedIds } = useTreeQuickPickerContext();

	return (
		<Badge
			className={clsx("quick-picker-tree-selected-count-badge", className)}
			aria-live="polite"
			{...props}
		>
			{selectedIds.size} Selected
		</Badge>
	);
};
