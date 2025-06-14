import { Controller, type ControllerProps } from "react-hook-form";
import {
	PasswordInputField,
	TextInputField,
	type PasswordInputFieldProps,
	type TextInputFieldProps,
} from "../../components/field";

export interface TextInputFieldControllerProps extends Omit<ControllerProps, "render"> {
	// not sure why the normal control prop is causing frequent type errors
	control?: any;
	textFieldProps: TextInputFieldProps;
}

export const TextInputFieldController = ({
	textFieldProps,
	...props
}: TextInputFieldControllerProps) => {
	return (
		<Controller
			render={({ field, fieldState }) => (
				<TextInputField
					error={fieldState.error?.message}
					{...textFieldProps}
					textInputProps={{
						ref: field.ref,
						onChange: field.onChange,
						onBlur: field.onBlur,
						value: field.value ?? "",
						disabled: field.disabled,
						...textFieldProps.textInputProps,
					}}
				/>
			)}
			{...props}
		/>
	);
};

export interface PasswordInputFieldControllerProps extends Omit<ControllerProps, "render"> {
	control?: any;
	passwordFieldProps: PasswordInputFieldProps;
}

export const PasswordInputFieldController = ({
	passwordFieldProps,
	...props
}: PasswordInputFieldControllerProps) => {
	return (
		<Controller
			render={({ field, fieldState }) => (
				<PasswordInputField
					error={fieldState.error?.message}
					{...passwordFieldProps}
					passwordInputProps={{
						ref: field.ref,
						onChange: field.onChange,
						onBlur: field.onBlur,
						value: field.value ?? "",
						disabled: field.disabled,
						...passwordFieldProps.passwordInputProps,
					}}
				/>
			)}
			{...props}
		/>
	);
};
