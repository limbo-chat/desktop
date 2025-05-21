import { useEffect, type HTMLProps, type PropsWithChildren } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type * as limbo from "limbo";
import { Checkbox } from "../../../components/checkbox";
import { Field, FieldDescription, FieldInfo, FieldLabel } from "../../../components/field";
import { TextInput } from "../../../components/text-input";
import type { PluginContext } from "../core/plugin-context";

interface TextSettingRendererProps {
	setting: limbo.TextSetting;
}

const TextSettingRenderer = ({ setting }: TextSettingRendererProps) => {
	return (
		<Controller
			name={setting.id}
			render={({ field }) => (
				<TextInput
					// @ts-expect-error, not exactly sure how to work with refs in react 19
					ref={field.ref}
					value={field.value || ""}
					onBlur={field.onBlur}
					onChange={field.onChange}
					disabled={field.disabled}
					placeholder={setting.placeholder}
					type={setting.variant === "password" ? "password" : undefined}
				/>
			)}
		/>
	);
};

interface BooleanSettingRendererProps {
	setting: limbo.BooleanSetting;
}

const BooleanSettingRenderer = ({ setting }: BooleanSettingRendererProps) => {
	return (
		<Controller
			name={setting.id}
			render={({ field }) => (
				<Checkbox
					checked={field.value || false}
					onCheckedChange={(e) => field.onChange(e.checked)}
					disabled={field.disabled}
				/>
			)}
		/>
	);
};

interface LLMSettingRendererProps {
	setting: limbo.LLMSetting;
}

const LLMSettingRenderer = ({ setting }: LLMSettingRendererProps) => {
	return (
		<Controller
			name={setting.id}
			render={({ field }) => (
				// temp text field
				<TextInput
					// @ts-expect-error, not exactly sure how to work with refs in react 19
					ref={field.ref}
					value={field.value || ""}
					onBlur={field.onBlur}
					onChange={field.onChange}
					disabled={field.disabled}
				/>
			)}
		/>
	);
};

const settingRendererMap = {
	text: TextSettingRenderer,
	boolean: BooleanSettingRenderer,
	llm: LLMSettingRenderer,
} as const;

interface SettingWrapperProps {
	setting: limbo.Setting;
}

const SettingField = ({ setting, children }: PropsWithChildren<SettingWrapperProps>) => {
	return (
		<Field variant="horizontal">
			<FieldInfo>
				<FieldLabel>{setting.label}</FieldLabel>
				<FieldDescription>{setting.description}</FieldDescription>
			</FieldInfo>
			{children}
		</Field>
	);
};

interface SettingRendererProps {
	setting: limbo.Setting;
}

const SettingRenderer = ({ setting }: SettingRendererProps) => {
	const Renderer = settingRendererMap[setting.type];

	return (
		<SettingField setting={setting}>
			{/* @ts-expect-error */}
			<Renderer setting={setting} />
		</SettingField>
	);
};

export interface PluginSettingsFormProps extends HTMLProps<HTMLFormElement> {
	plugin: PluginContext;
	onSubmit: (data: any) => void;
}

export const PluginSettingsForm = ({
	plugin,
	onSubmit,
	...htmlFormProps
}: PluginSettingsFormProps) => {
	const registeredSettings = plugin.getRegisteredSettings();

	const form = useForm({
		mode: "onBlur",
	});

	const handleSubmit = form.handleSubmit((data) => {
		onSubmit(data);
	});

	useEffect(() => {
		for (const setting of registeredSettings) {
			const settingValue = plugin.getCachedSetting(setting.id);

			form.setValue(setting.id, settingValue);
		}

		return () => {
			form.reset();
		};
	}, []);

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit} onBlur={handleSubmit} {...htmlFormProps}>
				{registeredSettings.map((setting) => (
					<SettingRenderer setting={setting} key={setting.id} />
				))}
			</form>
		</FormProvider>
	);
};
