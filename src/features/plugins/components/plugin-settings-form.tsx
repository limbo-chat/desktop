import { useEffect, type HTMLProps } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type * as limbo from "limbo";
import { Checkbox } from "../../../components/checkbox";
import { TextInput } from "../../../components/text-input";
import { TextInputFieldController } from "../../forms/components";
import { usePluginContextSettings } from "../../plugins/hooks/use-plugin-context-settings";
import type { ActivePlugin } from "../core/plugin-manager";

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
	plugin: ActivePlugin;
	onSubmit: (data: any) => void;
}

export const PluginSettingsForm = ({
	plugin,
	onSubmit,
	...htmlFormProps
}: PluginSettingsFormProps) => {
	const settings = usePluginContextSettings(plugin.context);

	const form = useForm({
		mode: "onBlur",
	});

	const handleSubmit = form.handleSubmit((data) => {
		onSubmit(data);
	});

	useEffect(() => {
		for (const setting of settings) {
			const settingValue = plugin.context.getCachedSettingValue(setting.id);

			form.setValue(setting.id, settingValue);
		}

		return () => {
			form.reset();
		};
	}, [settings]);

	return (
		<FormProvider {...form}>
			<form onSubmit={handleSubmit} onBlur={handleSubmit} {...htmlFormProps}>
				{settings.map((setting) => (
					<SettingRenderer setting={setting} key={setting.id} />
				))}
			</form>
		</FormProvider>
	);
};
