import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Button } from "../../../components/button";
import { Field } from "../../../components/field";
import * as FieldPrimitives from "../../../components/field-primitives";
import {
	Form,
	FormActions,
	FormContent,
	FormFooter,
	FormSection,
	FormSectionContent,
	FormSectionDescription,
	FormSectionHeader,
	FormSectionTitle,
} from "../../../components/form";
import { RadioOption } from "../../../components/radio-group";

export const Route = createFileRoute("/design-playground/elements/form")({
	component: FormElementPage,
});

const DemoForm = () => {
	const form = useForm();

	return (
		<Form>
			<FormContent>
				<FormSection data-section="profile">
					<FormSectionHeader>
						<FormSectionTitle>Profile</FormSectionTitle>
						<FormSectionDescription>
							This information will be displayed publicly so be careful what you share
						</FormSectionDescription>
					</FormSectionHeader>
					<FormSectionContent>
						<Field id="username" label="Username">
							<FieldPrimitives.TextInput
								placeholder="limbo.com/johndoe"
								{...form.register("username")}
							/>
						</Field>
						<Field
							id="about"
							label="About"
							description="Write a few sentences about yourself"
						>
							<FieldPrimitives.Textarea
								placeholder="Textareas allow a user to write a lot of text"
								{...form.register("about")}
							/>
						</Field>
					</FormSectionContent>
				</FormSection>
				<FormSection data-section="personal-information">
					<FormSectionHeader>
						<FormSectionTitle>Personal information</FormSectionTitle>
						<FormSectionDescription>
							Use a permanent address where you can receive mail.
						</FormSectionDescription>
					</FormSectionHeader>
					<FormSectionContent>
						<Field id="first-name" label="First name">
							<FieldPrimitives.TextInput
								placeholder="John"
								{...form.register("firstName")}
							/>
						</Field>
						<Field id="last-name" label="Last name">
							<FieldPrimitives.TextInput
								placeholder="Doe"
								{...form.register("lastName")}
							/>
						</Field>
					</FormSectionContent>
				</FormSection>
				<FormSection data-section="notifications">
					<FormSectionHeader>
						<FormSectionTitle>Notifications</FormSectionTitle>
						<FormSectionDescription>
							We'll always let you know about important changes, but you pick what
							else you want to hear about.
						</FormSectionDescription>
					</FormSectionHeader>
					<FormSectionContent>
						<Field id="visibility" label="Visibility">
							<FieldPrimitives.RadioGroup {...form.register("visibility")}>
								<RadioOption value="public" label="Public" />
								<RadioOption value="unlisted" label="Unlisted" />
								<RadioOption value="private" label="Private" />
							</FieldPrimitives.RadioGroup>
						</Field>
					</FormSectionContent>
				</FormSection>
			</FormContent>
			<FormFooter>
				<FormActions>
					<Button type="button" data-action="cancel" onClick={() => form.reset()}>
						Cancel
					</Button>
					<Button
						type="submit"
						data-action="submit"
						onClick={form.handleSubmit(() => {})}
					>
						Submit
					</Button>
				</FormActions>
			</FormFooter>
		</Form>
	);
};

function FormElementPage() {
	return (
		<div className="form-element-page">
			<DemoForm />
		</div>
	);
}
