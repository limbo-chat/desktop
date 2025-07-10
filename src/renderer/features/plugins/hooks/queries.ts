import { useMutation } from "@tanstack/react-query";
import { useMainRouter } from "../../../lib/trpc";
import type { SettingEntry } from "../core/plugin-backend";
import { usePluginStore } from "../stores";
import { usePluginBackend, usePluginManager, usePluginSystem } from "./core";

export interface EnablePluginMutationFnOpts {
	id: string;
}

export const useEnablePluginMutation = () => {
	const pluginSystem = usePluginSystem();
	const pluginBackend = usePluginBackend();

	return useMutation({
		mutationFn: async (opts: EnablePluginMutationFnOpts) => {
			await pluginBackend.enablePlugin(opts.id);

			const plugin = await pluginBackend.getPlugin(opts.id);

			await pluginSystem.loadPlugin(plugin);

			return plugin;
		},
		onSuccess: (plugin) => {
			const pluginStore = usePluginStore.getState();

			pluginStore.setPlugin(plugin.manifest.id, {
				...plugin,
				enabled: true,
			});
		},
	});
};

export interface DisablePluginMutationFnOpts {
	id: string;
}

export const useDisablePluginMutation = () => {
	const pluginSystem = usePluginSystem();
	const pluginBackend = usePluginBackend();

	return useMutation({
		mutationFn: async (opts: DisablePluginMutationFnOpts) => {
			await pluginSystem.unloadPlugin(opts.id);
			await pluginBackend.disablePlugin(opts.id);
		},
		onSettled: (_data, _err, opts) => {
			const pluginStore = usePluginStore.getState();
			const plugin = pluginStore.getPlugin(opts.id);

			if (!plugin) {
				return;
			}

			pluginStore.setPlugin(opts.id, {
				...plugin,
				enabled: false,
			});
		},
	});
};

export interface UpdatePluginSettingsMutationFnOpts {
	id: string;
	settings: SettingEntry[];
}

export const useUpdatePluginSettingsMutation = () => {
	const pluginBackend = usePluginBackend();
	const pluginManager = usePluginManager();

	return useMutation({
		mutationFn: async (opts: UpdatePluginSettingsMutationFnOpts) => {
			await pluginBackend.updatePluginSettings(opts.id, opts.settings);
		},
		onSuccess: (_, opts) => {
			const plugin = pluginManager.getPlugin(opts.id);

			if (!plugin) {
				return;
			}

			for (const [key, value] of Object.entries(opts.settings)) {
				plugin.context.setCachedSettingValue(key, value);
			}
		},
	});
};

export const useInstallPluginMutation = () => {
	const mainRouter = useMainRouter();

	return useMutation(
		mainRouter.plugins.install.mutationOptions({
			onSuccess: (manifest) => {
				const pluginStore = usePluginStore.getState();

				pluginStore.setPlugin(manifest.id, {
					manifest,
					enabled: false, // newly installed plugins are disabled by default
				});
			},
		})
	);
};

export interface UninstallPluginMutationFnOpts {
	id: string;
}

export const useUninstallPluginMutation = () => {
	const pluginSystem = usePluginSystem();
	const pluginBackend = usePluginBackend();

	return useMutation({
		mutationFn: async (opts: UninstallPluginMutationFnOpts) => {
			await pluginSystem.unloadPlugin(opts.id);
			await pluginBackend.uninstallPlugin(opts.id);
		},
		onSuccess: async (_, opts) => {
			const pluginStore = usePluginStore.getState();

			pluginStore.removePlugin(opts.id);
		},
	});
};
