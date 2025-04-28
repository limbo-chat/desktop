import type { HTMLAttributes } from "react";
import clsx from "clsx";

export interface SettingsPageProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsPage = ({ className, ...props }: SettingsPageProps) => {
	return <div className={clsx("settings-page", className)} {...props} />;
};
