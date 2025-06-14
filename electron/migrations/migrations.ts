/*
The migration map should be used to bring the previous version to the current version.

* The only migrations that will be included in the map will be CURRENT_MIGRATION_VERSION - 1 *

Lets say the current version is 2, but the user has version 1:
The only migration that needs to be run is migration 1 to bring the user from version 1 to version 2.

If the user has version 1, but the current version is 3:
The migrations that need to be run are 1 and 2 to bring the user from version 1 to version 3.
*/
export const migrations: Record<number, () => void | Promise<void>> = {} as const;
