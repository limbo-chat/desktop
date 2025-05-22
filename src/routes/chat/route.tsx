import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useMeasure } from "@uidotdev/usehooks";
import { ChatComposer } from "./-components/chat-composer";
import { ChatSidebar } from "./-components/chat-sidebar";

export const Route = createFileRoute("/chat")({
	component: ChatLayout,
});

function ChatLayout() {
	const [chatComposerRef, chatComposerDimensions] = useMeasure();

	return (
		<div className="chat-page">
			<ChatSidebar />
			<div
				className="chat-content"
				style={{
					// @ts-expect-error
					"--chat-composer-height": chatComposerDimensions.height + "px",
					"--chat-composer-width": chatComposerDimensions.width + "px",
				}}
			>
				<Outlet />
				<ChatComposer ref={chatComposerRef} />
			</div>
		</div>
	);
}
