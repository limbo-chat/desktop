import { useEffect, useMemo, type HTMLProps } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type * as limbo from "limbo";
import { Checkbox } from "../../../components/checkbox";
import { PasswordInputFieldController, TextInputFieldController } from "../../forms/components";
import { useLLMList } from "../../llms/hooks";
import { usePluginContextSettings } from "../../plugins/hooks/use-plugin-context-settings";
import type { ActivePlugin } from "../core/plugin-manager";

// TODO, some of the settings renderers are incomplete

interface TextSettingRendererProps {
	setting: limbo.TextSetting;
}

const TextSettingRenderer = ({ setting }: TextSettingRendererProps) => {
	if (setting.variant === "password") {
		return (
			<PasswordInputFieldController
				name={setting.id}
				passwordFieldProps={{
					label: setting.label,
					description: setting.description,
					passwordInputProps: {
						placeholder: setting.placeholder,
					},
				}}
			/>
		);
	}

	return (
		<TextInputFieldController
			name={setting.id}
			textFieldProps={{
				label: setting.label,
				description: setting.description,
				textInputProps: {
					placeholder: setting.placeholder,
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
	const llms = useLLMList();

	const filteredLLMs = useMemo(() => {
		if (!setting.capabilities || setting.capabilities.length === 0) {
			return llms;
		}

		return llms.filter((llm) => {
			for (const capability of setting.capabilities!) {
				if (!llm.capabilities.includes(capability)) {
					return false;
				}
			}

			return true;
		});
	}, [llms, setting.capabilities]);

	return (
		<Controller
			name={setting.id}
			render={({ field }) => (
				// placeholder until a better llm selector is implemented for plugin settings
				<select onChange={(e) => field.onChange(e.target.value)} value={field.value || ""}>
					{filteredLLMs.map((llm) => (
						<option value={llm.id} key={llm.id}>
							{llm.name}
						</option>
					))}
				</select>
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
