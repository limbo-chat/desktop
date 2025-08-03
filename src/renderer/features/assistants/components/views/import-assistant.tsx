import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { assistantSchema } from "../../../../../main/assistants/schemas";
import { Button } from "../../../../components/button";
import * as FieldController from "../../../../components/field-controller";
import * as Form from "../../../../components/form-primitive";
import * as View from "../../../view-stack/components/view";
import { useCreateAssistantMutation } from "../../hooks/queries";

const importAssistantFormSchema = z.object({
	payload: z.string().min(1, "An assistant payload is required"),
});

export const ImportAssistantView = () => {
	const createAssistantMutation = useCreateAssistantMutation();

	const form = useForm({
		mode: "onChange",
		resolver: zodResolver(importAssistantFormSchema),
	});

	const handleSubmit = form.handleSubmit((data) => {
		let rawAssistant;

		try {
			rawAssistant = JSON.parse(data.payload);
		} catch (error) {
			form.setError("payload", {
				type: "manual",
				message: "Invalid JSON format",
			});

			return;
		}

		const parsedAssistant = assistantSchema.safeParse(rawAssistant);

		if (!parsedAssistant.success) {
			form.setError("payload", {
				type: "manual",
				message: "Invalid assistant structure",
			});

			return;
		}

		console.log("Parsed assistant:", parsedAssistant.data);
	});

	return (
		<FormProvider {...form}>
			<View.Root as="form" onSubmit={handleSubmit}>
				<View.Header>
					<View.HeaderStart>
						<View.BackButton type="button" />
						<View.TitleProps>Import assistant</View.TitleProps>
					</View.HeaderStart>
				</View.Header>
				<View.Content>
					<Form.Root as="div">
						<Form.Content>
							<FieldController.Root
								id="payload"
								name="payload"
								label="Assistant JSON"
								description="Paste the assistant JSON payload here."
							>
								<FieldController.Textarea placeholder="{}" />
							</FieldController.Root>
						</Form.Content>
					</Form.Root>
				</View.Content>
				<View.Footer>
					<View.FooterActions>
						<Button
							type="submit"
							disabled={!form.formState.isValid}
							isLoading={createAssistantMutation.isPending}
						>
							Import
						</Button>
					</View.FooterActions>
				</View.Footer>
			</View.Root>
		</FormProvider>
	);
};
