import { clsx } from "clsx";
import { useState } from "react";
import { AppIcon } from "./app-icon";
import { IconButton } from "./icon-button";

export interface PasswordInputProps extends React.ComponentProps<"input"> {}

export const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<div
			className={clsx("password-input", className)}
			data-state={isVisible ? "visible" : "hidden"}
		>
			<IconButton onClick={() => setIsVisible((prev) => !prev)}>
				{isVisible ? <AppIcon icon="visibility-off" /> : <AppIcon icon="visibility" />}
			</IconButton>
			<input type={isVisible ? "text" : "password"} {...props} />
		</div>
	);
};
