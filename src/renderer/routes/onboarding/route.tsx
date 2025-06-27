import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/onboarding")({
	component: OnboardingLayout,
});

function OnboardingLayout() {
	return (
		<div className="onboarding">
			<div className="onboarding-header" />
			<div className="onboarding-content">
				<Outlet />
			</div>
		</div>
	);
}
