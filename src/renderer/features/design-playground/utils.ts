import { showModal } from "../modals/utils";
import { DesignPlaygroundTabs } from "./components/design-playground-tabs";

export function showDesignPlaygroundModal() {
	showModal({
		className: "design-playground-modal",
		component: DesignPlaygroundTabs,
	});
}
