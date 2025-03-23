import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../components/button";
import { Text } from "../components/text";
import { TextInput } from "../components/text-input";
import { Tooltip } from "../components/tooltip";

export const Route = createFileRoute("/")({
	component: ChatPage,
});

function ChatPage() {
	return (
		<div className="tw:p-[20px]">
			<TextInput placeholder="Search homes" />
		</div>
	);
}
