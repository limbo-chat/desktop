import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import clsx from "clsx";
import { Checkbox } from "../../../components/checkbox";
import * as QuickPicker from "./primitive";

interface ListQuickPickerContext {
	focusedId: string | null;
	selectedId: string | null;
	selectItem: (id: string) => void;
	registerItemElement: (itemId: string, element: HTMLElement) => void;
	unregisterItemElement: (itemId: string) => void;
}

const listQuickPickerContext = createContext<ListQuickPickerContext | null>(null);

export const useListQuickPickerContext = () => {
	const ctx = useContext(listQuickPickerContext);

	if (!ctx) {
		throw new Error("useListQuickPickerContext must be used within a ListQuickPicker");
	}

	return ctx;
};

export interface RootProps extends Omit<QuickPicker.RootProps, "onSelect"> {
	items: string[];
	focusedId: string | null;
	selectedId: string | null;
	onFocusedIdChange: (newFocusedId: string | null) => void;
	onSelectedIdChange: (newSelectedId: string) => void;
}

export const Root = ({
	items,
	focusedId,
	selectedId,
	onFocusedIdChange,
	onSelectedIdChange,
	...props
}: RootProps) => {
	const itemRefs = useMemo<Map<string, HTMLElement | null>>(() => new Map(), []);

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

	const focusItem = (id: string) => {
		scrollToItem(id);
		onFocusedIdChange(id);
	};

	const selectItem = (id: string) => {
		onSelectedIdChange(id);
	};

	const selectFocused = () => {
		if (!focusedId) {
			return;
		}

		selectItem(focusedId);
	};

	const moveFocusUp = () => {
		const currentIndex = items.findIndex((itemId) => itemId === focusedId);

		const prevIndex = (currentIndex - 1 + items.length) % items.length;
		const prevId = items[prevIndex]!;

		focusItem(prevId);
	};

	const moveFocusDown = () => {
		const currentIndex = items.findIndex((itemId) => itemId === focusedId);

		const nextIndex = (currentIndex + 1) % items.length;
		const nextId = items[nextIndex]!;

		focusItem(nextId);
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
			case "Enter":
				e.preventDefault();
				selectFocused();
				break;
		}
	};

	useEffect(() => {
		const firstItem = items[0];

		if (firstItem) {
			focusItem(firstItem);
		}
	}, [items]);

	return (
		<listQuickPickerContext.Provider
			value={{
				focusedId,
				selectedId,
				selectItem,
				registerItemElement,
				unregisterItemElement,
			}}
		>
			<QuickPicker.Root onKeyDown={onKeyDown} {...props} />
		</listQuickPickerContext.Provider>
	);
};

export interface ListProps extends React.ComponentProps<"ul"> {}

export const List = ({ className, ...props }: ListProps) => {
	const { focusedId } = useListQuickPickerContext();

	return (
		<ul
			className={clsx("quick-picker-list", className)}
			role="listbox"
			tabIndex={-1}
			aria-activedescendant={focusedId ?? undefined}
			{...props}
		/>
	);
};

export interface ListItemData {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
}

export interface ListItemProps extends Omit<React.ComponentProps<"li">, "onSelect"> {
	item: ListItemData;
}

export const ListItem = ({ item, className, ...props }: ListItemProps) => {
	const { focusedId, selectedId, selectItem, registerItemElement, unregisterItemElement } =
		useListQuickPickerContext();

	const ref = useRef<HTMLLIElement>(null);
	const isSelected = selectedId === item.id;
	const isFocused = focusedId === item.id;

	const handleSelect = () => {
		selectItem(item.id);
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
		<li
			ref={ref}
			id={item.id}
			className={clsx("quick-picker-list-item", className)}
			role="option"
			data-is-focused={isFocused}
			data-is-selected={isSelected}
			aria-selected={isSelected}
			onClick={handleSelect}
			{...props}
		>
			{item.icon && <div className="quick-picker-list-item-icon">{item.icon}</div>}
			<div className="quick-picker-list-item-title">{item.title}</div>
			<div className="quick-picker-list-item-description">{item.description}</div>
		</li>
	);
};
