export function addCustomStyle(path: string) {
	const link = document.createElement("link");

	link.id = `custom-style:${path}`;
	link.rel = "stylesheet";
	link.href = `custom://style/${path}?v=${Date.now()}`;

	document.head.appendChild(link);
}

export function removeCustomStyle(path: string) {
	const link = document.getElementById(`custom-style:${path}`);

	if (!link) {
		return;
	}

	link.parentNode!.removeChild(link);
}
