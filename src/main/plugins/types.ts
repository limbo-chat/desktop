export interface PluginDatabaseSettingTable {
	id: string;
	value: string;
}

export interface PluginDatabaseStorageTable {
	key: string;
	value: string;
}

export interface PluginDatabase {
	storage: PluginDatabaseStorageTable;
	setting: PluginDatabaseSettingTable;
}
