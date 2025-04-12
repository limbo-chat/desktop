import { usePluginRegisteredSettings } from "../hooks";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type { Plugin } from "../core/plugin";
import type * as limbo from "limbo";
import { useEffect, type HTMLProps, type PropsWithChildren } from "react";
import { TextInput } from "../../../components/text-input";
import { Text } from "../../../components/text";

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
				// TODO, will replace with switch component
				<input
					type="checkbox"
					checked={field.value || false}
					onChange={(e) => field.onChange(e.target.checked)}
					disabled={field.disabled}
				/>
			)}
		/>
	);
};

const settingRendererMap = {
	text: TextSettingRenderer,
	boolean: BooleanSettingRenderer,
} as const;

interface SettingWrapperProps {
	setting: limbo.Setting;
}

const SettingWrapper = ({ setting, children }: PropsWithChildren<SettingWrapperProps>) => {
	return (
		<div className="flex justify-between items-center">
			<div>
				<label htmlFor={setting.id}>{setting.title}</label>
				<Text size="sm" color="muted">
					{setting.helpText}
				</Text>
			</div>
			{children}
		</div>
	);
};

interface SettingRendererProps {
	setting: limbo.Setting;
}

const SettingRenderer = ({ setting }: SettingRendererProps) => {
	const Renderer = settingRendererMap[setting.type];

	if (!Renderer) {
		return null;
	}

	return (
		<SettingWrapper setting={setting}>
			{/* @ts-expect-error */}
			<Renderer setting={setting} />
		</SettingWrapper>
	);
};

export interface PluginSettingsFormProps extends HTMLProps<HTMLFormElement> {
	plugin: Plugin;
	onSubmit: (data: any) => void;
}

export const PluginSettingsForm = ({
	plugin,
	onSubmit,
	...htmlFormProps
}: PluginSettingsFormProps) => {
	const registeredSettings = usePluginRegisteredSettings(plugin);

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
