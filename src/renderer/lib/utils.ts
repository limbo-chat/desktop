export const buildNamespacedResourceId = (pluginId: string, pluginResourceId: string) =>
	`${pluginId}/${pluginResourceId}`;

export function parseNamespacedResourceId(resourceId: string) {
	const parts = resourceId.split("/");

	if (parts.length !== 2) {
		return null;
	}

	const namespace = parts[0];
	const resource = parts[1];

	return {
		namespace,
		resource,
	};
}
