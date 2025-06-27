import { createFileRoute } from "@tanstack/react-router";
import { LinkButton } from "../../components/link";

export const Route = createFileRoute("/onboarding/")({
	component: SplashPage,
});

function SplashPage() {
	return (
		<div className="splash-page">
			<div className="splash">
				<div className="splash-logo"></div>
				<div className="splash-version">Version 0.0.0</div>
			</div>
			<LinkButton to="/onboarding/theme">Get started</LinkButton>
		</div>
	);
}
