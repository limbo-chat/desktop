import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useWindowInfoContext } from "../features/window-info/hooks";

export const Route = createFileRoute("/")({
	component: () => {
		const windowInfo = useWindowInfoContext();

		if (windowInfo.id === "onboarding") {
			return <Navigate to="/onboarding" />;
		}

		return <Navigate to="/chat" />;
	},
});
