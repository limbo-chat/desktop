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

export const Route = createFileRoute("/onboarding/_steps/plugins")({
	component: PluginsStep,
});

function PluginsStep() {
	return (
		<Step id="theme">
			<StepHeader>
				<StepTitle>
					<StepIndicator totalSteps={3} currentStep={2} />
					Recommended plugins
				</StepTitle>
				<StepDescription>
					Plugins make limbo better. We recommend installing these plugins for a better
					experience.
				</StepDescription>
			</StepHeader>
			<StepContent>
				<SettingItem>
					<SettingItemInfo>
						<SettingItemTitle>Plugin 1</SettingItemTitle>
						<SettingItemDescription>
							This is a description of Plugin 1.
						</SettingItemDescription>
					</SettingItemInfo>
					<SettingItemControl>
						<Button>Install</Button>
					</SettingItemControl>
				</SettingItem>
			</StepContent>
			<StepFooter>
				<StepActions>
					<LinkButton to="/onboarding/theme">Back</LinkButton>
					<LinkButton to="/onboarding/finish">Next</LinkButton>
				</StepActions>
			</StepFooter>
		</Step>
	);
}
