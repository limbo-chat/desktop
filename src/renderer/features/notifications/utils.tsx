import { toast } from "sonner";
import { Notification, type NotificationProps } from "./components";

export function showNotification(notification: Omit<NotificationProps, "onClose">) {
	toast.custom((toastId) => (
		<Notification onClose={() => toast.dismiss(toastId)} {...notification} />
	));
}
