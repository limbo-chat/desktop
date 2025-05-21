import { clsx } from "clsx";
import type { InputHTMLAttributes, Ref } from "react";

export interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
	ref?: Ref<HTMLInputElement>;
}

export const TextInput = ({ className, ...textInputProps }: TextInputProps) => {
	return <input type="text" className={clsx("text-input", className)} {...textInputProps} />;
};
