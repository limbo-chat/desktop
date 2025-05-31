import { clsx } from "clsx";
import type { InputHTMLAttributes, Ref } from "react";
import { InputWrapper, type InputWrapperProps } from "./input-wrapper";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement>, InputWrapperProps {
	ref?: Ref<HTMLInputElement>;
}

export const TextInput = ({ className, leftSection, rightSection, ...props }: TextInputProps) => {
	return (
		<InputWrapper
			className={clsx("text-input", className)}
			leftSection={leftSection}
			rightSection={rightSection}
		>
			<input type="text" {...props} />
		</InputWrapper>
	);
};
