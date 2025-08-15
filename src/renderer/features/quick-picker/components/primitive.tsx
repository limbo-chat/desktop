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

export interface HeaderProps extends React.ComponentProps<"div"> {}

export const Header = ({ className, ...props }: HeaderProps) => {
	return <div className={clsx("quick-picker-header", className)} {...props} />;
};

export interface IndicatorsProps extends React.ComponentProps<"div"> {}

export const Indicators = ({ className, ...props }: ActionProps) => {
	return <div className={clsx("quick-picker-indicators", className)} {...props} />;
};

export interface ActionProps extends React.ComponentProps<"div"> {}

export const PrimaryAction = ({ className, ...props }: ActionProps) => {
	return <div className={clsx("quick-picker-primary-action", className)} {...props} />;
};

export interface Search extends React.ComponentProps<"div"> {}

export const Search = ({ className, ...props }: Search) => {
	return <div className={clsx("quick-picker-search", className)} {...props} />;
};

export interface SearchInputProps extends React.ComponentProps<"input"> {}

export const SearchInput = ({ className, ...props }: SearchInputProps) => {
	return (
		<input className={clsx("quick-picker-search-input", className)} type="text" {...props} />
	);
};

export interface SearchAccessoriesProps extends React.ComponentProps<"div"> {}

export const SearchAccessories = ({ className, ...props }: SearchAccessoriesProps) => {
	return <div className={clsx("quick-picker-search-accessories", className)} {...props} />;
};

export interface ContentProps extends React.ComponentProps<"div"> {}

export const Content = ({ className, ...props }: ContentProps) => {
	return <div className={clsx("quick-picker-content", className)} {...props} />;
};

export interface FooterProps extends React.ComponentProps<"div"> {}

export const Footer = ({ className, ...props }: FooterProps) => {
	return <div className={clsx("quick-picker-footer", className)} {...props} />;
};
