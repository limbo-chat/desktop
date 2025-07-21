import type { JSONColumnType } from "kysely";

export interface PluginDatabaseSettingTable {
	id: string;
	value: JSONColumnType<any>;
}

export interface PluginDatabaseStorageTable {
	key: string;
	value: JSONColumnType<any>;
}

export interface PluginDatabase {
	storage: PluginDatabaseStorageTable;
	setting: PluginDatabaseSettingTable;
}
