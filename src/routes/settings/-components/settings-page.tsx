import clsx from "clsx";
import type { HTMLAttributes } from "react";

export interface SettingsPageProps extends HTMLAttributes<HTMLDivElement> {}

export const SettingsPage = ({ className, ...props }: SettingsPageProps) => {
	return <div className={clsx("settings-page", className)} {...props} />;
};
