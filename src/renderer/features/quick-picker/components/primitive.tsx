import clsx from "clsx";

export interface RootProps extends React.ComponentProps<"div"> {}

export const Root = ({ className, ...props }: RootProps) => {
	return <div className={clsx("quick-picker", className)} {...props} />;
};

export interface TitleBarProps extends React.ComponentProps<"div"> {}

export const TitleBar = ({ className, ...props }: TitleBarProps) => {
	return <div className={clsx("quick-picker-title-bar", className)} {...props} />;
};

export interface TitleProps extends React.ComponentProps<"div"> {}

export const Title = ({ className, ...props }: TitleProps) => {
	return <div className={clsx("quick-picker-title", className)} {...props} />;
};

export interface SplitProps extends React.ComponentProps<"div"> {}

export const Split = ({ className, ...props }: SplitProps) => {
	return <div className={clsx("quick-picker-split", className)} {...props} />;
};

export interface MasterProps extends React.ComponentProps<"div"> {}

export const Master = ({ className, ...props }: MasterProps) => {
	return <div className={clsx("quick-picker-master", className)} {...props} />;
};

export interface DetailProps extends React.ComponentProps<"div"> {}

export const Detail = ({ className, ...props }: DetailProps) => {
	return <div className={clsx("quick-picker-detail", className)} {...props} />;
};

export interface HeaderProps extends React.ComponentProps<"div"> {}

export const Header = ({ className, ...props }: HeaderProps) => {
	return <div className={clsx("quick-picker-header", className)} {...props} />;
};

export interface SearchProps extends React.ComponentProps<"input"> {}

export const Search = ({ className, ...props }: SearchProps) => {
	return <input className={clsx("quick-picker-search", className)} type="text" {...props} />;
};

export interface ContentProps extends React.ComponentProps<"div"> {}

export const Content = ({ className, ...props }: ContentProps) => {
	return <div className={clsx("quick-picker-content", className)} {...props} />;
};

export interface FooterProps extends React.ComponentProps<"div"> {}

export const Footer = ({ className, ...props }: FooterProps) => {
	return <div className={clsx("quick-picker-footer", className)} {...props} />;
};

// list primitives

export interface ListProps extends React.ComponentProps<"ul"> {
	activeItemId: string | null;
}

export const List = ({ activeItemId, className, ...props }: ListProps) => {
	return (
		<ul
			className={clsx("quick-picker-list", className)}
			role="listbox"
			tabIndex={-1}
			aria-activedescendant={activeItemId ?? undefined}
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
	isSelected: boolean;
	isActive: boolean;
	onActivate: () => void;
	onSelect: () => void;
}

export const ListItem = ({
	item,
	isActive,
	isSelected,
	onActivate,
	onSelect,
	className,
	...props
}: ListItemProps) => {
	return (
		<li
			id={item.id}
			className={clsx("quick-picker-list-item", className)}
			role="option"
			data-is-active={isActive}
			data-is-selected={isSelected}
			aria-selected={isSelected}
			onMouseEnter={onActivate}
			onClick={onSelect}
			{...props}
		>
			{item.icon && <div className="quick-picker-list-item-icon">{item.icon}</div>}
			<div className="quick-picker-list-item-title">{item.title}</div>
			<div className="quick-picker-list-item-description">{item.description}</div>
		</li>
	);
};
