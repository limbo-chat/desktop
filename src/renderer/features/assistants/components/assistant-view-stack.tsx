import { ViewStack } from "../../view-stack/components";
import { AssistantsView } from "./views/assistants";
import { CreateAssistantView } from "./views/create-assistant";

const assistantViews = {
	"assistants": AssistantsView,
	"create-assistant": CreateAssistantView,
} as const;

export const AssistantViewStack = () => {
	return <ViewStack defaultView={{ id: "assistants" }} views={assistantViews} />;
};
