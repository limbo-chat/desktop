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

export interface SettingsActionsProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsActions = ({ className, ...props }: SettingsActionsProps) => {
	return <div className={clsx("settings-actions", className)} {...props} />;
};

export interface SettingsFormProps extends HTMLAttributes<HTMLFormElement> {}

export const SettingsForm = ({ className, ...props }: SettingsFormProps) => {
	return <form className={clsx("settings-form")} {...props} />;
};
