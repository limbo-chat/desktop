import { clsx } from "clsx";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState, type InputHTMLAttributes, type Ref } from "react";
import { IconButton } from "../icon-button";
import { InputWrapper } from "./input-wrapper";

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
	ref?: Ref<HTMLInputElement>;
}

export const PasswordInput = ({ className, ...props }: PasswordInputProps) => {
	const [isVisible, setIsVisible] = useState(false);

	return (
		<InputWrapper
			className={clsx("password-input", className)}
			rightSection={
				<IconButton onClick={() => setIsVisible((prev) => !prev)}>
					{isVisible ? <EyeOffIcon /> : <EyeIcon />}
				</IconButton>
			}
			data-state={isVisible ? "visible" : "hidden"}
		>
			<input type={isVisible ? "text" : "password"} {...props} />
		</InputWrapper>
	);
};
