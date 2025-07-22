import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../../components/button";
import * as FieldController from "../../../../components/field-controller";
import * as Form from "../../../../components/form-primitive";
import { useMainRouter } from "../../../../lib/trpc";
import * as View from "../../../view-stack/components/view";
import { useViewStackContext } from "../../../view-stack/hooks";
import { useCreateAssistantMutation } from "../../hooks/queries";
import { BaseAssistantFormFields } from "../assistant-form-fields";

const createAssistantFormSchema = z.object({
	id: z.string().min(1, "An ID is required"),
	name: z.string().min(1, "A name is required"),
	description: z.string().min(1, "A description is required"),
	systemPrompt: z.string().min(1, "A system prompt is required"),
	recommendedPlugins: z.array(z.string()),
	recommendedTools: z.array(z.string()),
});

export const CreateAssistantView = () => {
	const mainRouter = useMainRouter();
	const queryClient = useQueryClient();
	const createAssistantMutation = useCreateAssistantMutation();
	const viewStack = useViewStackContext();

	const form = useForm({
		resolver: zodResolver(createAssistantFormSchema),
		mode: "onChange",
		defaultValues: {
			id: "",
			name: "",
			description: "",
			systemPrompt: "",
			recommendedPlugins: [],
			recommendedTools: [],
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		createAssistantMutation.mutate(
			{
				assistant: data,
			},
			{
				onSuccess: () => {
					queryClient.invalidateQueries(mainRouter.assistants.getAll.queryFilter());
					viewStack.pop();
				},
			}
		);
	});

	return (
		<FormProvider {...form}>
			<View.Root as="form" onSubmit={handleSubmit}>
				<View.Header>
					<View.BackButton type="button" />
					<View.TitleProps>Create assistant</View.TitleProps>
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
						<Button type="submit" disabled={!form.formState.isValid}>
							Create
						</Button>
					</View.FooterActions>
				</View.Footer>
			</View.Root>
		</FormProvider>
	);
};
