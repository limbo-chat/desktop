import { createContext } from "react";
import type { PluginBackend } from "./core/plugin-backend";
import type { PluginManager } from "./core/plugin-manager";
import type { PluginSystem } from "./core/plugin-system";

export const pluginBackendContext = createContext<PluginBackend | null>(null);

export const pluginManagerContext = createContext<PluginManager | null>(null);

export const pluginSystemContext = createContext<PluginSystem | null>(null);
