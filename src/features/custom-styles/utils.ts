export function addCustomStyle(path: string, content: string) {
	const style = document.createElement("style");

	style.id = `custom-style:${path}`;
	style.textContent = content;

	document.head.appendChild(style);
}

export function removeCustomStyle(path: string) {
	const style = document.getElementById(`custom-style:${path}`);

	if (!style) {
		return;
	}

	style.parentNode!.removeChild(style);
}
