// hopefully this still gets tree shaken
import * as lucide from "lucide-react";
import type * as limbo from "@limbo/api";

const appIcons: Record<limbo.AppIcon, any> = {
	file: lucide.FileIcon,
	folder: lucide.FolderIcon,
	search: lucide.SearchIcon,
	check: lucide.CheckIcon,
	info: lucide.InfoIcon,
	person: lucide.UserIcon,
	warning: lucide.AlertTriangleIcon,
} as const;

// for now its fine to extend the LucideProps as we only have LucideIcons in here

export interface AppIconProps extends lucide.LucideProps {
	icon: limbo.AppIcon;
}

export const AppIcon = ({ icon, ...props }: AppIconProps) => {
	const Icon = appIcons[icon];

	return <Icon {...props} />;
};
