import type * as limbo from "@limbo/api";

// storage

export interface PluginStorageGetOArgs {
	pluginId: string;
	key: string;
}

export interface PluginStorageSetArgs {
	pluginId: string;
	key: string;
	value: limbo.JsonValue;
}

export interface PluginStorageRemoveArgs {
	pluginId: string;
	key: string;
}

export interface PluginStorageClearArgs {
	pluginId: string;
}

export interface PluginEnvironmentStorage {
	get: (opts: PluginStorageGetOArgs) => Promise<limbo.JsonValue | undefined>;
	set: (opts: PluginStorageSetArgs) => Promise<void>;
	remove: (opts: PluginStorageRemoveArgs) => Promise<void>;
	clear: (opts: PluginStorageClearArgs) => Promise<void>;
}

// database

export interface PluginDatabaseQueryArgs {
	pluginId: string;
	sql: string;
	params?: any[];
}

export interface PluginEnvironmentDatabase {
	query: (opts: PluginDatabaseQueryArgs) => Promise<limbo.database.QueryResult>;
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

export interface PluginShowNotificationArgs {
	pluginId: string;
	notification: limbo.Notification;
}

export interface PluginEnvironmentUI {
	showNotification: (opts: PluginShowNotificationArgs) => void;
	showChatPanel: typeof limbo.ui.showChatPanel;
}

export interface PluginEnvironmentAuthenticateArgs {
	pluginId: string;
	options: limbo.auth.AuthenticateOptions;
}

export interface PluginEnvironmentAuth {
	authenticate: (opts: PluginEnvironmentAuthenticateArgs) => Promise<string>;
}

export interface PluginEnvironment {
	storage: PluginEnvironmentStorage;
	database: PluginEnvironmentDatabase;
	chats: PluginEnvironmentChats;
	models: PluginEnvironmentModels;
	ui: PluginEnvironmentUI;
	auth: PluginEnvironmentAuth;
}
