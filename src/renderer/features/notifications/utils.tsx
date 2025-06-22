import { toast } from "sonner";
import { Notification, type NotificationProps } from "./components";

export function showNotification(notification: NotificationProps) {
	toast.custom((_id) => <Notification {...notification} />);
}
