import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as QuickPicker from "./primitive";

interface ListQuickPickerContext {
	activeItemId: string | null;
	selectedItemId: string | null;
	setActiveItemId: (id: string) => void;
	setSelectedItemId: (id: string | null) => void;
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
	selectedItemId: string | null;
	onSelect: (id: string | null) => void;
}

export const Root = ({ items, selectedItemId, onSelect, ...props }: RootProps) => {
	const [activeItemIdx, setActiveItemIdx] = useState<number>(0);

	const activeItemId = useMemo(() => {
		return items[activeItemIdx] ?? null;
	}, [items, activeItemIdx]);

	const onKeyDown = (e: React.KeyboardEvent) => {
		switch (e.key) {
			case "ArrowUp":
				setActiveItemIdx((prev) => (prev - 1 + items.length) % items.length);
				break;
			case "ArrowDown":
				setActiveItemIdx((prev) => (prev + 1) % items.length);
				break;
			case "Enter":
				onSelect(activeItemId);
		}
	};

	const setActiveItemId = (id: string) => {
		const itemIdx = items.findIndex((itemId) => itemId === id);

		setActiveItemIdx(itemIdx ?? 0);
	};

	useEffect(() => {
		setActiveItemIdx(0);
	}, [items]);

	return (
		<listQuickPickerContext.Provider
			value={{
				activeItemId,
				selectedItemId,
				setActiveItemId,
				setSelectedItemId: onSelect,
			}}
		>
			<QuickPicker.Root onKeyDown={onKeyDown} {...props} />
		</listQuickPickerContext.Provider>
	);
};

export interface ListProps extends Omit<QuickPicker.ListProps, "activeItemId"> {}

export const List = (props: ListProps) => {
	const { activeItemId } = useListQuickPickerContext();

	return <QuickPicker.List activeItemId={activeItemId} {...props} />;
};

export interface ListItemProps
	extends Omit<QuickPicker.ListItemProps, "onActivate" | "onSelect" | "isActive" | "isSelected"> {
	onSelect?: () => void;
}

export const ListItem = ({ item, onSelect, ...props }: ListItemProps) => {
	const { selectedItemId, activeItemId, setSelectedItemId, setActiveItemId } =
		useListQuickPickerContext();

	const handleOnSelect = () => {
		setSelectedItemId(item.id);

		if (onSelect) {
			onSelect();
		}
	};

	return (
		<QuickPicker.ListItem
			item={item}
			isSelected={selectedItemId === item.id}
			isActive={activeItemId === item.id}
			onSelect={handleOnSelect}
			onActivate={() => setActiveItemId(item.id)}
			{...props}
		/>
	);
};
