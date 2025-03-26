import { createContext } from "react";
import type { PluginManager } from "./core/plugin-manager";

export const PluginManagerContext = createContext<PluginManager | null>(null);
