import clsx from "clsx";

export interface SettingsSectionProps extends React.ComponentProps<"section"> {}

export const SettingsSection = ({ className, ...props }: SettingsSectionProps) => {
	return <section className={clsx("settings-section", className)} {...props} />;
};

export interface SettingsSectionHeaderProps extends React.ComponentProps<"div"> {}

export const SettingsSectionHeader = ({ className, ...props }: SettingsSectionHeaderProps) => {
	return <div className={clsx("settings-section-header", className)} {...props} />;
};

export interface SettingsSectionTitleProps extends React.ComponentProps<"h2"> {}

export const SettingsSectionTitle = ({ className, ...props }: SettingsSectionTitleProps) => {
	return <h2 className={clsx("settings-section-title", className)} {...props} />;
};

export const SettingsSectionDescription = ({ className, ...props }: SettingsSectionTitleProps) => {
	return <h2 className={clsx("settings-section-description", className)} {...props} />;
};

export interface SettingsSectionContentProps extends React.ComponentProps<"div"> {}

export const SettingsSectionContent = ({ className, ...props }: SettingsSectionContentProps) => {
	return <div className={clsx("settings-section-content")} {...props} />;
};

export interface SettingItemProps extends React.ComponentProps<"div"> {}

export const SettingItem = ({ className, ...props }: SettingItemProps) => {
	return <div className={clsx("setting-item")} {...props} />;
};

export interface SettingItemInfoProps extends React.ComponentProps<"div"> {}

export const SettingItemInfo = ({ className, ...props }: SettingItemInfoProps) => {
	return <div className={clsx("setting-item-info")} {...props} />;
};

export interface SettingItemTitleProps extends React.ComponentProps<"div"> {}

export const SettingItemTitle = ({ className, ...props }: SettingItemTitleProps) => {
	return <div className={clsx("setting-item-title")} {...props} />;
};

export interface SettingItemDescriptionProps extends React.ComponentProps<"div"> {}

export const SettingItemDescription = ({ className, ...props }: SettingItemDescriptionProps) => {
	return <div className={clsx("setting-item-description")} {...props} />;
};

export interface SettingItemControlProps extends React.ComponentProps<"div"> {}

export const SettingItemControl = ({ className, ...props }: SettingItemControlProps) => {
	return <div className={clsx("setting-item-control")} {...props} />;
};
