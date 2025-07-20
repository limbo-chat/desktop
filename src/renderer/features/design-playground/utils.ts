import { showModal } from "../modals/utils";
import { DesignPlaygroundTabs } from "./components/design-playground-tabs";

export function showDesignPlaygroundModal() {
	showModal({
		id: "design-playground",
		component: DesignPlaygroundTabs,
	});
}
