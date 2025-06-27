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

export const Route = createFileRoute("/onboarding/_steps/theme")({
	component: ThemeStep,
});

function ThemeStep() {
	return (
		<Step id="theme">
			<StepHeader>
				<StepTitle>
					<StepIndicator totalSteps={3} currentStep={1} />
					Theme
				</StepTitle>
				<StepDescription>Limbo is styled by css</StepDescription>
			</StepHeader>
			<StepContent>
				<SettingItem>
					<SettingItemInfo>
						<SettingItemTitle>Remove default styles</SettingItemTitle>
						<SettingItemDescription>
							This is not recommended for most users
						</SettingItemDescription>
					</SettingItemInfo>
					<SettingItemControl>
						<Button>Remove</Button>
					</SettingItemControl>
				</SettingItem>
			</StepContent>
			<StepFooter>
				<StepActions>
					<LinkButton to="/onboarding">Back</LinkButton>
					<LinkButton to="/onboarding/plugins">Next</LinkButton>
				</StepActions>
			</StepFooter>
		</Step>
	);
}
