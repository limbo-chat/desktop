import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { Text } from "../../components/text";
import { usePlugins } from "../../features/plugins/hooks";
import { type PropsWithChildren } from "react";
import { ArrowLeftIcon } from "lucide-react";
import clsx from "clsx";

export const Route = createFileRoute("/settings")({
	component: SettingsLayout,
});

interface SidebarLinkProps {
	isActive: boolean;
}

const SidebarLink = ({ isActive, children }: PropsWithChildren<SidebarLinkProps>) => {
	return (
		<div
			className={clsx("p-sm rounded-md hover:bg-secondary-hover", isActive && "bg-secondary")}
		>
			{children}
		</div>
	);
};

const Sidebar = () => {
	const plugins = usePlugins();
	const location = useLocation();

	return (
		<div className="bg-surface w-[250px] p-md border-r flex gap-md flex-col border-border">
			<div className="flex flex-col gap-sm">
				<Link to="/chat">
					<SidebarLink isActive={false}>
						<div className="flex items-center gap-xs">
							<ArrowLeftIcon size={18} />
							Go back
						</div>
					</SidebarLink>
				</Link>
				<Link to="/settings">
					<SidebarLink isActive={location.pathname.endsWith("/settings")}>
						General
					</SidebarLink>
				</Link>
				<Link to="/settings/plugins">
					<SidebarLink isActive={location.pathname.endsWith("/settings/plugins")}>
						Plugins
					</SidebarLink>
				</Link>
			</div>
			<div className="flex flex-col gap-sm">
				<Text size="sm" color="muted" weight="medium" className="ml-sm">
					Plugins
				</Text>
				<div className="flex flex-col gap-sm">
					{plugins.map((plugin) => (
						<Link
							to="/settings/plugins/$id"
							params={{ id: plugin.manifest.id }}
							key={plugin.manifest.id}
						>
							<SidebarLink
								isActive={location.pathname.endsWith(
									`/settings/plugins/${plugin.manifest.id}`
								)}
							>
								{plugin.manifest.name}
							</SidebarLink>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

function SettingsLayout() {
	return (
		<div className="flex min-h-svh">
			<Sidebar />
			<div className="flex-1 p-lg">
				<Outlet />
			</div>
		</div>
	);
}
