import * as RadixTabs from "@radix-ui/react-tabs";
import clsx from "clsx";

export interface RootProps extends RadixTabs.TabsProps {}

export const Root = ({ className, ...props }: RootProps) => {
	return (
		<RadixTabs.Root
			className={clsx("vertical-tabs-container", className)}
			orientation="vertical"
			{...props}
		/>
	);
};

export interface ListProps extends RadixTabs.TabsListProps {}

export const List = ({ className, ...props }: ListProps) => {
	return <RadixTabs.List className={clsx("vertical-tabs-list", className)} {...props} />;
};

export interface ListSectionProps extends React.ComponentProps<"div"> {}

export const ListSection = ({ className, ...props }: ListSectionProps) => {
	return <div className={clsx("vertical-tabs-list-section", className)} {...props} />;
};

export interface ListSectionHeaderProps extends React.ComponentProps<"div"> {}

export const ListSectionHeader = ({ className, ...props }: ListSectionHeaderProps) => (
	<div className={clsx("vertical-tabs-list-section-header", className)} {...props} />
);

export interface ListSectionTitleProps extends React.ComponentProps<"div"> {}

export const ListSectionTitle = ({ className, ...props }: ListSectionTitleProps) => (
	<div className={clsx("vertical-tabs-list-section-title", className)} {...props} />
);

export interface ListSectionContentProps extends React.ComponentProps<"div"> {}

export const ListSectionContent = ({ className, ...props }: ListSectionContentProps) => (
	<div className={clsx("vertical-tabs-list-section-content", className)} {...props} />
);

export interface ListSectionItemProps extends RadixTabs.TabsTriggerProps {}

export const ListSectionItem = ({ className, ...props }: ListSectionItemProps) => {
	return <RadixTabs.Trigger className={clsx("vertical-tabs-list-item", className)} {...props} />;
};

export interface ContentProps extends RadixTabs.TabsContentProps {}

export const Content = ({ className, ...props }: ContentProps) => {
	return (
		<RadixTabs.Content
			className={clsx("vertical-tabs-content", className)}
			data-tab={props.value}
			{...props}
		/>
	);
};
