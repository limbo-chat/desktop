import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../components/button";
import {
	DialogDescription,
	DialogFooter,
	DialogHeader,
	Dialog,
	DialogTitle,
	DialogActions,
	DialogContent,
} from "../../../components/dialog";
import * as FieldController from "../../../components/field-controller";
import { useModalContext } from "../../modals/hooks";
import { useInstallPluginMutation, useUninstallPluginMutation } from "../hooks/queries";

const installPluginFormSchema = z.object({
	repoUrl: z.string().regex(/^https:\/\/github\.com\/[^/]+\/[^/]+$/, {
		message: "Please enter a valid GitHub repo URL",
	}),
});

export const InstallPluginDialog = () => {
	const modalCtx = useModalContext();
	const installPluginMutation = useInstallPluginMutation();

	const form = useForm({
		resolver: zodResolver(installPluginFormSchema),
		values: {
			repoUrl: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		const repoParts = data.repoUrl.split("/");
		const repoOwner = repoParts[3]!;
		const repoName = repoParts[4]!;

		installPluginMutation.mutate(
			{
				owner: repoOwner,
				repo: repoName,
			},
			{
				onSuccess: () => {
					modalCtx.close();
				},
			}
		);
	});

	return (
		<FormProvider {...form}>
			<Dialog component="form" onSubmit={onSubmit}>
				<DialogHeader>
					<DialogTitle>Install plugin</DialogTitle>
					<DialogDescription>
						Enter the GitHub repository URL of the plugin you want to install.
					</DialogDescription>
				</DialogHeader>
				<DialogContent>
					<FieldController.Root id="repo-url" name="repoUrl">
						<FieldController.TextInput placeholder="https://github.com/limbo-llm/plugin-ollama" />
					</FieldController.Root>
				</DialogContent>
				<DialogFooter>
					<DialogActions>
						<Button onClick={modalCtx.close}>Cancel</Button>
						<Button
							type="submit"
							disabled={!form.formState.isDirty}
							isLoading={installPluginMutation.isPending}
						>
							Install
						</Button>
					</DialogActions>
				</DialogFooter>
			</Dialog>
		</FormProvider>
	);
};
