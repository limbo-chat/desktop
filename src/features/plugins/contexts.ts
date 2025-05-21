import { createContext } from "react";
import type { PluginManager } from "./core/plugin-manager";

export const pluginManagerContext = createContext<PluginManager | null>(null);
