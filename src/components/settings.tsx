import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface SettingsSectionProps extends HTMLAttributes<HTMLElement> {}

export const SettingsSection = ({ className, ...props }: SettingsSectionProps) => {
	return <section className={clsx("settings-section", className)} {...props} />;
};

export interface SettingsSectionHeaderProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsSectionHeader = ({ className, ...props }: SettingsSectionHeaderProps) => {
	return <div className={clsx("settings-section-header", className)} {...props} />;
};

export interface SettingsSectionTitleProps extends HTMLAttributes<HTMLHeadingElement> {}

export const SettingsSectionTitle = ({ className, ...props }: SettingsSectionTitleProps) => {
	return <h2 className={clsx("settings-section-title", className)} {...props} />;
};

export interface SettingsSectionContentProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsSectionContent = ({ className, ...props }: SettingsSectionContentProps) => {
	return <div className={clsx("settings-section-content")} {...props} />;
};

export interface SettingsSectionActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsSectionActions = ({ className, ...props }: SettingsSectionActionsProps) => {
	return <div className={clsx("settings-section-actions", className)} {...props} />;
};

export interface SettingItemProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingItem = ({ className, ...props }: SettingItemProps) => {
	return <div className={clsx("setting-item")} {...props} />;
};

export interface SettingItemInfoProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingItemInfo = ({ className, ...props }: SettingItemInfoProps) => {
	return <div className={clsx("setting-item-info")} {...props} />;
};

export interface SettingItemTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingItemTitle = ({ className, ...props }: SettingItemTitleProps) => {
	return <div className={clsx("setting-item-title")} {...props} />;
};

export interface SettingItemDescriptionProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingItemDescription = ({ className, ...props }: SettingItemDescriptionProps) => {
	return <div className={clsx("setting-item-description")} {...props} />;
};

export interface SettingItemControlProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingItemControl = ({ className, ...props }: SettingItemControlProps) => {
	return <div className={clsx("setting-item-control")} {...props} />;
};
