import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/button";
import * as FieldController from "../../../components/field-controller";
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

const demoFormSchema = z.object({
	username: z.string().min(2).max(50),
	about: z
		.string()
		.min(10, {
			message: "Please provide at least 10 characters about yourself",
		})
		.max(500, {
			message: "Too long",
		}),
	firstName: z.string().min(1, { message: "First name is required" }),
	lastName: z.string().min(1, { message: "Last name is required" }),
	visibility: z.enum(["public", "unlisted", "private"]),
});

const DemoForm = () => {
	const form = useForm({
		resolver: zodResolver(demoFormSchema),
		defaultValues: {
			visibility: "public",
		},
	});

	const handleCancel = () => {
		form.reset();
	};

	const handleSubmit = form.handleSubmit((data) => {
		console.log(data);
	});

	return (
		<FormProvider {...form}>
			<Form onSubmit={handleSubmit}>
				<FormContent>
					<FormSection data-section="profile">
						<FormSectionHeader>
							<FormSectionTitle>Profile</FormSectionTitle>
							<FormSectionDescription>
								This information will be displayed publicly so be careful what you
								share
							</FormSectionDescription>
						</FormSectionHeader>
						<FormSectionContent>
							<FieldController.Root id="username" name="username" label="Username">
								<FieldController.TextInput placeholder="limbo.com/johndoe" />
							</FieldController.Root>
							<FieldController.Root
								id="about"
								name="about"
								label="About"
								description="Write a few sentences about yourself"
							>
								<FieldController.Textarea placeholder="Textareas allow a user to write a lot of text" />
							</FieldController.Root>
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
							<FieldController.Root
								id="first-name"
								name="firstName"
								label="First name"
							>
								<FieldController.TextInput placeholder="John" />
							</FieldController.Root>
							<FieldController.Root id="last-name" name="lastName" label="Last name">
								<FieldController.TextInput placeholder="Doe" />
							</FieldController.Root>
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
							<FieldController.Root
								id="visibility"
								name="visibility"
								label="Visibility"
							>
								<FieldController.RadioGroup>
									<RadioOption value="public" label="Public" />
									<RadioOption value="unlisted" label="Unlisted" />
									<RadioOption value="private" label="Private" />
								</FieldController.RadioGroup>
							</FieldController.Root>
						</FormSectionContent>
					</FormSection>
				</FormContent>
				<FormFooter>
					<FormActions>
						<Button
							type="button"
							data-action="cancel"
							disabled={!form.formState.isDirty}
							onClick={handleCancel}
						>
							Cancel
						</Button>
						<Button
							type="submit"
							data-action="submit"
							disabled={!form.formState.isDirty}
						>
							Submit
						</Button>
					</FormActions>
				</FormFooter>
			</Form>
		</FormProvider>
	);
};

function FormElementPage() {
	return (
		<div className="form-element-page">
			<DemoForm />
		</div>
	);
}
