import { ViewStack } from "../../view-stack/components";
import { CreateAssistantView } from "./views/create-assistant";
import { UpdateAssistantView } from "./views/update-assistant";
import { AssistantsView } from "./views/view-assistants";

const assistantViews = {
	"view-assistants": AssistantsView,
	"create-assistant": CreateAssistantView,
	"update-assistant": UpdateAssistantView,
} as const;

export const AssistantViewStack = () => {
	return <ViewStack defaultView={{ id: "view-assistants", data: null }} views={assistantViews} />;
};
