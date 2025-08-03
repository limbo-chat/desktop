import * as RadixTabs from "@radix-ui/react-tabs";
import clsx from "clsx";

export interface RootProps extends RadixTabs.TabsProps {}

export const Root = ({ className, ...props }: RootProps) => {
	return (
		<RadixTabs.Root
			className={clsx("horizontal-tabs", className)}
			orientation="horizontal"
			{...props}
		/>
	);
};

export interface ListProps extends RadixTabs.TabsListProps {}

export const List = ({ className, ...props }: ListProps) => {
	return <RadixTabs.List className={clsx("horizontal-tabs-list", className)} {...props} />;
};

export interface TabTriggerProps extends RadixTabs.TabsTriggerProps {}

export const TabTrigger = ({ className, ...props }: TabTriggerProps) => {
	return (
		<RadixTabs.Trigger className={clsx("horizontal-tabs-tab-trigger", className)} {...props} />
	);
};

export interface ContentProps extends RadixTabs.TabsContentProps {}

export const Content = ({ className, ...props }: ContentProps) => {
	return (
		<RadixTabs.Content
			className={clsx("horizontal-tabs-content", className)}
			data-tab={props.value}
			{...props}
		/>
	);
};
