import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../../components/button";
import * as FieldController from "../../../../components/field-controller";
import * as Form from "../../../../components/form-primitive";
import * as View from "../../../view-stack/components/view";
import { useViewStackContext } from "../../../view-stack/hooks";
import { useCreateAssistantMutation } from "../../hooks/queries";
import { baseAssistantFormSchema } from "../../schemas";
import { BaseAssistantFormFields } from "../assistant-form-fields";

const createAssistantFormSchema = baseAssistantFormSchema.extend({
	id: z.string().min(1, "An ID is required"),
});

export const CreateAssistantView = () => {
	const createAssistantMutation = useCreateAssistantMutation();
	const viewStack = useViewStackContext();

	const form = useForm({
		resolver: zodResolver(createAssistantFormSchema),
		mode: "onChange",
		defaultValues: {
			id: "",
			name: "",
			description: "",
			system_prompt: "",
			recommended_plugins: [],
			recommended_tools: [],
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		createAssistantMutation.mutate(
			{
				assistant: data,
			},
			{
				onSuccess: () => {
					viewStack.pop();
				},
				onError: (err) => {
					// Handle error, e.g., show a notification
					console.error("Failed to create assistant", err);
				},
			}
		);
	});

	return (
		<FormProvider {...form}>
			<View.Root as="form" onSubmit={handleSubmit}>
				<View.Header>
					<View.HeaderStart>
						<View.BackButton type="button" />
						<View.TitleProps>Create assistant</View.TitleProps>
					</View.HeaderStart>
				</View.Header>
				<View.Content>
					<Form.Root as="div">
						<Form.Content>
							<FieldController.Root
								id="id"
								name="id"
								label="ID"
								description="Enter a unique ID for your assistant"
							>
								<FieldController.TextInput placeholder="my-assistant" />
							</FieldController.Root>
							<BaseAssistantFormFields />
						</Form.Content>
					</Form.Root>
				</View.Content>
				<View.Footer>
					<View.FooterActions>
						<Button disabled={!form.formState.isDirty} onClick={() => form.reset()}>
							Reset
						</Button>
						<Button
							type="submit"
							disabled={!form.formState.isValid}
							isLoading={createAssistantMutation.isPending}
						>
							Create
						</Button>
					</View.FooterActions>
				</View.Footer>
			</View.Root>
		</FormProvider>
	);
};
