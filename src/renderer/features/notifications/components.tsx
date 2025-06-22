export interface NotificationProps {
	title: string;
	message: string;
}

export const Notification = ({ title, message }: NotificationProps) => {
	return (
		<div className="notification">
			<div className="notification-title">{title}</div>
			<div className="notification-message">{message}</div>
		</div>
	);
};
