import { CircleXIcon, InfoIcon, TriangleAlertIcon, XIcon } from "lucide-react";
import type { FC } from "react";
import { IconButton } from "../../components/icon-button";

export type NotificationLevel = "info" | "warning" | "error";

export interface NotificationProps {
	level: NotificationLevel;
	title: string;
	message?: string;
	source?: string;
	onClose: () => void;
}

const notificationLevelIconMap: Record<NotificationLevel, FC> = {
	info: InfoIcon,
	warning: TriangleAlertIcon,
	error: CircleXIcon,
} as const;

export const Notification = ({ level, title, message, source, onClose }: NotificationProps) => {
	const Icon = notificationLevelIconMap[level];

	return (
		<div className="notification" data-level={level}>
			<div className="notification-header">
				<div className="notification-icon">
					<Icon />
				</div>
				<div className="notification-title">{title}</div>
				<IconButton className="notification-close-button" onClick={() => onClose()}>
					<XIcon />
				</IconButton>
			</div>
			{message && (
				<div className="notification-content">
					<div className="notification-message">{message}</div>
				</div>
			)}
			{source && (
				<div className="notification-footer">
					<div className="notification-source">{source}</div>
					{/* <div className="notification-actions"></div> */}
				</div>
			)}
		</div>
	);
};
