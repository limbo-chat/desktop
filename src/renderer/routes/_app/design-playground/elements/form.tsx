import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import * as FieldController from "../../../../components/field-controller";
import * as Form from "../../../../components/form-primitive";
import { RadioOption } from "../../../../components/radio-group";
import * as RhfForm from "../../../../components/rhf-form";

export const Route = createFileRoute("/_app/design-playground/elements/form")({
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

	const handleSubmit = form.handleSubmit((data) => {
		console.log(data);
	});

	return (
		<FormProvider {...form}>
			<Form.Root onSubmit={handleSubmit}>
				<Form.Content>
					<Form.Section id="profile">
						<Form.SectionHeader>
							<Form.SectionTitle>Profile</Form.SectionTitle>
							<Form.SectionDescription>
								This information will be displayed publicly so be careful what you
								share
							</Form.SectionDescription>
						</Form.SectionHeader>
						<Form.SectionContent>
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
						</Form.SectionContent>
					</Form.Section>
					<Form.Section id="personal-information">
						<Form.SectionHeader>
							<Form.SectionTitle>Personal information</Form.SectionTitle>
							<Form.SectionDescription>
								Use a permanent address where you can receive mail.
							</Form.SectionDescription>
						</Form.SectionHeader>
						<Form.SectionContent>
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
						</Form.SectionContent>
					</Form.Section>
					<Form.Section id="notifications">
						<Form.SectionHeader>
							<Form.SectionTitle>Notifications</Form.SectionTitle>
							<Form.SectionDescription>
								We'll always let you know about important changes, but you pick what
								else you want to hear about.
							</Form.SectionDescription>
						</Form.SectionHeader>
						<Form.SectionContent>
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
						</Form.SectionContent>
					</Form.Section>
				</Form.Content>
				<Form.Footer>
					<Form.Actions>
						<RhfForm.ResetButton>Cancel</RhfForm.ResetButton>
						<Form.SubmitButton>Submit</Form.SubmitButton>
					</Form.Actions>
				</Form.Footer>
			</Form.Root>
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
