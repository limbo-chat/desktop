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
import { useModalContext } from "../../modals/hooks";
import { useUninstallPluginMutation } from "../hooks/queries";

export interface UninstallPluginDialogProps {
	plugin: {
		id: string;
		name: string;
	};
}

export const UninstallPluginDialog = ({ plugin }: UninstallPluginDialogProps) => {
	const modalCtx = useModalContext();
	const uninstallPluginMutation = useUninstallPluginMutation();

	const handleUninstall = () => {
		uninstallPluginMutation.mutate(
			{
				id: plugin.id,
			},
			{
				onSuccess: () => {
					modalCtx.close();
				},
			}
		);
	};

	return (
		<Dialog>
			<DialogHeader>
				<DialogTitle>Uninstall {plugin.name}</DialogTitle>
			</DialogHeader>
			<DialogContent>
				<p>
					Are you sure you want to uninstall this plugin? The plugin and associated data
					will be deleted.
				</p>
			</DialogContent>
			<DialogFooter>
				<DialogActions>
					<Button onClick={modalCtx.close}>Cancel</Button>
					<Button isLoading={uninstallPluginMutation.isPending} onClick={handleUninstall}>
						Uninstall
					</Button>
				</DialogActions>
			</DialogFooter>
		</Dialog>
	);
};
