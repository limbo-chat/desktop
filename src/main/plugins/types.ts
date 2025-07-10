export interface PluginDatabaseSettingsTable {
	id: string;
	value: string;
}

export interface PluginDatabase {
	settings: PluginDatabaseSettingsTable;
}
