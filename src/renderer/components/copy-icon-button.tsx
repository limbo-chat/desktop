import { useState } from "react";
import { AppIcon } from "./app-icon";
import { IconButton, type IconButtonProps } from "./icon-button";

export interface CopyButtonProps extends Omit<IconButtonProps, "onClick" | "children"> {
	content: string;
}

export const CopyIconButton = ({ content, ...props }: CopyButtonProps) => {
	const [copied, setCopied] = useState(false);

	const handleClick = async () => {
		setCopied(true);

		setTimeout(() => {
			setCopied(false);
			// the duration is not configurable so that the behavior is always consistent
		}, 1000);

		try {
			await navigator.clipboard.writeText(content);
		} catch {
			// noop
		}
	};

	return (
		<IconButton
			action="copy"
			className="copy-button"
			data-is-copied={copied ?? undefined}
			aria-label="Copy text" // not super descriptive, users of CopyIconButton can override it
			{...props}
			onClick={handleClick}
		>
			{copied ? <AppIcon icon="check" /> : <AppIcon icon="copy" />}
		</IconButton>
	);
};
