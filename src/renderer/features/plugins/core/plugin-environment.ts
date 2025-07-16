import type * as limbo from "@limbo/api";

// storage

export interface PluginStorageGetOptions {
	pluginId: string;
	key: string;
}

export interface PluginStorageSetOptions {
	pluginId: string;
	key: string;
	value: limbo.JsonValue;
}

export interface PluginStorageRemoveOptions {
	pluginId: string;
	key: string;
}

export interface PluginStorageClearOptions {
	pluginId: string;
}

export interface PluginEnvironmentStorage {
	get: (opts: PluginStorageGetOptions) => Promise<limbo.JsonValue | undefined>;
	set: (opts: PluginStorageSetOptions) => Promise<void>;
	remove: (opts: PluginStorageRemoveOptions) => Promise<void>;
	clear: (opts: PluginStorageClearOptions) => Promise<void>;
}

// database

export interface PluginDatabaseQueryOptions {
	pluginId: string;
	sql: string;
	params?: any[];
}

export interface PluginEnvironmentDatabase {
	query: (opts: PluginDatabaseQueryOptions) => Promise<limbo.database.QueryResult>;
}

// chats

export interface PluginEnvironmentChats {
	get: typeof limbo.chats.get;
	rename: typeof limbo.chats.rename;
	getMessages: typeof limbo.chats.getMessages;
}

// models

export interface PluginEnvironmentModels {
	getLLM: (llmId: string) => limbo.LLM | undefined;
}

// ui

// notifications

export interface PluginShowNotificationOptions {
	pluginId: string;
	notification: limbo.Notification;
}

export interface PluginEnvironmentUI {
	showNotification: (opts: PluginShowNotificationOptions) => void;
	showChatPanel: typeof limbo.ui.showChatPanel;
}

export interface PluginEnvironment {
	storage: PluginEnvironmentStorage;
	database: PluginEnvironmentDatabase;
	chats: PluginEnvironmentChats;
	models: PluginEnvironmentModels;
	ui: PluginEnvironmentUI;
}
