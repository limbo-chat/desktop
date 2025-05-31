import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useMeasure } from "@uidotdev/usehooks";
import { ChatComposer } from "./-components/chat-composer";
import { ChatSidebar } from "./-components/chat-sidebar";

export const Route = createFileRoute("/chat")({
	component: ChatLayout,
});

function ChatLayout() {
	const [chatComposerRef, chatComposerDimensions] = useMeasure();

	const areChatComposerDimensionsAvailable =
		typeof chatComposerDimensions.width === "number" &&
		typeof chatComposerDimensions.height === "number";

	return (
		<div className="chat-layout">
			<ChatSidebar />
			<div
				className="chat-content"
				style={{
					// @ts-expect-error
					"--chat-composer-height": chatComposerDimensions.height + "px",
					"--chat-composer-width": chatComposerDimensions.width + "px",
				}}
			>
				{areChatComposerDimensionsAvailable && <Outlet />}
				<ChatComposer ref={chatComposerRef} />
			</div>
		</div>
	);
}
