import { useEffect } from "react";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { addMarkdownElement, removeMarkdownElement } from "../../markdown/utils";
import { codeElement } from "./code";
import { inputElement } from "./input";
import { linkElement } from "./link";

export const useRegisterCoreMarkdownElements = () => {
	useEffect(() => {
		const linkElementId = buildNamespacedResourceId("core", linkElement.element);
		const inputElementId = buildNamespacedResourceId("core", inputElement.element);
		const codeElementId = buildNamespacedResourceId("core", codeElement.element);

		addMarkdownElement(linkElementId, linkElement);
		addMarkdownElement(inputElementId, inputElement);
		addMarkdownElement(codeElementId, codeElement);

		return () => {
			removeMarkdownElement(linkElementId);
			removeMarkdownElement(inputElementId);
			removeMarkdownElement(codeElementId);
		};
	}, []);
};
