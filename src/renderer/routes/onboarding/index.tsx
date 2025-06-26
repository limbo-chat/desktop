import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding/")({
	component: OnboardingPage,
});

function OnboardingPage() {
	return <div>Hello "/onboarding/"!</div>;
}
