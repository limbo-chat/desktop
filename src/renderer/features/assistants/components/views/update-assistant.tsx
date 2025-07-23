import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { Button } from "../../../../components/button";
import * as Form from "../../../../components/form-primitive";
import { useMainRouter } from "../../../../lib/trpc";
import * as View from "../../../view-stack/components/view";
import { useViewStackContext } from "../../../view-stack/hooks";
import type { ViewComponentProps } from "../../../view-stack/types";
import { useUpdateAssistantMutation } from "../../hooks/queries";
import { baseAssistantFormSchema } from "../../schemas";
import { BaseAssistantFormFields } from "../assistant-form-fields";

export interface UpdateAssistantViewData {
	assistantId: string;
}

export const UpdateAssistantView = ({ view }: ViewComponentProps<UpdateAssistantViewData>) => {
	const mainRouter = useMainRouter();
	const updateAssistantMutation = useUpdateAssistantMutation();
	const viewStack = useViewStackContext();

	const getAssitantQuery = useSuspenseQuery(
		mainRouter.assistants.get.queryOptions({
			id: view.data.assistantId,
		})
	);

	const assistant = getAssitantQuery.data;

	const form = useForm({
		resolver: zodResolver(baseAssistantFormSchema),
		mode: "onChange",
		values: {
			name: assistant.name,
			description: assistant.description,
			systemPrompt: assistant.systemPrompt,
			recommendedPlugins: assistant.recommendedPlugins,
			recommendedTools: assistant.recommendedTools,
		},
	});

	const { isValid, isDirty } = form.formState;

	const handleSubmit = form.handleSubmit((data) => {
		updateAssistantMutation.mutate(
			{
				id: assistant.id,
				data,
			},
			{
				onSuccess: () => {
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
					<View.TitleProps>Update assistant</View.TitleProps>
				</View.Header>
				<View.Content>
					<Form.Root as="div">
						<Form.Content>
							<BaseAssistantFormFields />
						</Form.Content>
					</Form.Root>
				</View.Content>
				<View.Footer>
					<View.FooterActions>
						<Button
							type="submit"
							disabled={!isDirty || !isValid}
							isLoading={updateAssistantMutation.isPending}
						>
							Save changes
						</Button>
					</View.FooterActions>
				</View.Footer>
			</View.Root>
		</FormProvider>
	);
};
