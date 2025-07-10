export interface PluginDatabaseSettingTable {
	id: string;
	value: string;
}

export interface PluginDatabase {
	setting: PluginDatabaseSettingTable;
}
