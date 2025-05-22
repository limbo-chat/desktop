import { useEffect, type HTMLProps } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type * as limbo from "limbo";
import { Checkbox } from "../../../components/checkbox";
import { TextInput } from "../../../components/text-input";
import { TextInputFieldController } from "../../forms/components";
import type { PluginContext } from "../core/plugin-context";

// TODO, some of the settings renderers are incomplete

interface TextSettingRendererProps {
	setting: limbo.TextSetting;
}

const TextSettingRenderer = ({ setting }: TextSettingRendererProps) => {
	return (
		<TextInputFieldController
			name={setting.id}
			textFieldProps={{
				label: setting.label,
				description: setting.description,
				textInputProps: {
					placeholder: setting.placeholder,
					type: setting.variant === "password" ? "password" : "text",
				},
			}}
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

interface SettingRendererProps {
	setting: limbo.Setting;
}

const SettingRenderer = ({ setting }: SettingRendererProps) => {
	const Renderer = settingRendererMap[setting.type];

	// @ts-expect-error
	return <Renderer setting={setting} />;
};

export interface PluginSettingsFormProps extends HTMLProps<HTMLFormElement> {
	pluginContext: PluginContext;
	onSubmit: (data: any) => void;
}

export const PluginSettingsForm = ({
	pluginContext,
	onSubmit,
	...htmlFormProps
}: PluginSettingsFormProps) => {
	const registeredSettings = pluginContext.getSettings();

	const form = useForm({
		mode: "onBlur",
	});

	const handleSubmit = form.handleSubmit((data) => {
		onSubmit(data);
	});

	useEffect(() => {
		for (const setting of registeredSettings) {
			const settingValue = pluginContext.getCachedSettingValue(setting.id);

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
