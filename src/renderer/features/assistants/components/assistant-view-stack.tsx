import { ViewStack } from "../../view-stack/components";
import { CreateAssistantView } from "./views/create-assistant";
import { EditAssistantView } from "./views/edit-assistant";
import { ImportAssistantView } from "./views/import-assistant";
import { ViewAssistantView } from "./views/view-assistant";
import { AssistantsView } from "./views/view-assistants";

const assistantViews = {
	"view-assistants": AssistantsView,
	"view-assistant": ViewAssistantView,
	"create-assistant": CreateAssistantView,
	"edit-assistant": EditAssistantView,
	"import-assistant": ImportAssistantView,
} as const;

export const AssistantViewStack = () => {
	return <ViewStack defaultView={{ id: "view-assistants", data: null }} views={assistantViews} />;
};
