import { useMutation } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	Step,
	StepActions,
	StepContent,
	StepDescription,
	StepFooter,
	StepHeader,
	StepIndicator,
	StepTitle,
} from "../-components/step";
import { Button } from "../../../components/button";
import { LinkButton } from "../../../components/link";
import {
	SettingItem,
	SettingItemControl,
	SettingItemDescription,
	SettingItemInfo,
	SettingItemTitle,
} from "../../../components/settings";
import { useMainRouter } from "../../../lib/trpc";

export const Route = createFileRoute("/onboarding/_steps/finish")({
	component: FinishStep,
});

function FinishStep() {
	const mainRouter = useMainRouter();
	const completeOnboardingMutation = useMutation(
		mainRouter.onboarding.complete.mutationOptions()
	);

	const handleFinishOnboarding = () => {
		completeOnboardingMutation.mutate();
	};

	return (
		<Step id="finish">
			<StepHeader>
				<StepTitle>
					<StepIndicator totalSteps={3} currentStep={3} />
					You're all set up!
				</StepTitle>
				<StepDescription>You can now start using limbo!</StepDescription>
			</StepHeader>
			<StepContent>
				<SettingItem>
					<SettingItemInfo>
						<SettingItemTitle>Official help site</SettingItemTitle>
						<SettingItemDescription>
							Read the official help codocumentation for limbo.
						</SettingItemDescription>
					</SettingItemInfo>
					<SettingItemControl>
						<LinkButton>Visit</LinkButton>
					</SettingItemControl>
				</SettingItem>
				<SettingItem>
					<SettingItemInfo>
						<SettingItemTitle>Discord community</SettingItemTitle>
						<SettingItemDescription>
							Discord is the best place to chat with other limbo users, get help, and
							share ideas.
						</SettingItemDescription>
					</SettingItemInfo>
					<SettingItemControl>
						<LinkButton>Join</LinkButton>
					</SettingItemControl>
				</SettingItem>
			</StepContent>
			<StepFooter>
				<StepActions>
					<LinkButton to="/onboarding/plugins">Back</LinkButton>
					<Button action="finish" onClick={handleFinishOnboarding}>
						Finish
					</Button>
				</StepActions>
			</StepFooter>
		</Step>
	);
}
