import { useMemo } from "react";
import { Controller, FormProvider, useForm } from "react-hook-form";
import type * as limbo from "@limbo/api";
import { Checkbox } from "../../../components/checkbox";
import { PasswordInput } from "../../../components/password-input";
import {
	SettingItem,
	SettingItemControl,
	SettingItemDescription,
	SettingItemInfo,
	SettingItemTitle,
	SettingsSection,
	SettingsSectionContent,
} from "../../../components/settings";
import { useLLMList } from "../../llms/hooks";

// TODO, some of the settings renderers are incomplete

interface TextSettingRendererProps {
	setting: limbo.TextSetting;
}

const TextSettingRenderer = ({ setting }: TextSettingRendererProps) => {
	if (setting.variant === "password") {
		return (
			<Controller
				name={setting.id}
				render={({ field }) => (
					<PasswordInput
						ref={field.ref}
						placeholder={setting.placeholder}
						disabled={field.disabled}
						value={field.value ?? ""}
						onChange={(e) => field.onChange(e.target.value)}
						onBlur={field.onBlur}
					/>
				)}
			/>
		);
	}

	return (
		<Controller
			name={setting.id}
			render={({ field }) => (
				<input
					type="text"
					ref={field.ref}
					placeholder={setting.placeholder}
					disabled={field.disabled}
					value={field.value ?? ""}
					onChange={(e) => field.onChange(e.target.value)}
					onBlur={field.onBlur}
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
					onCheckedChange={(isChecked) => field.onChange(isChecked as boolean)}
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

	return (
		<SettingItem>
			<SettingItemInfo>
				<SettingItemTitle>{setting.label}</SettingItemTitle>
				<SettingItemDescription>{setting.description}</SettingItemDescription>
			</SettingItemInfo>
			<SettingItemControl>
				{/* @ts-expect-error idk */}
				<Renderer setting={setting} />
			</SettingItemControl>
		</SettingItem>
	);
};

export interface PluginSettingsSectionProps {
	values: Record<string, any>;
	settings: limbo.Setting[];
	onSubmit: (data: Record<string, any>) => void;
}

export const PluginSettingsSection = ({
	settings,
	values,
	onSubmit,
}: PluginSettingsSectionProps) => {
	const form = useForm({
		values,
	});

	const handleSubmit = form.handleSubmit((data) => {
		onSubmit(data);
	});

	return (
		<FormProvider {...form}>
			<form onBlur={handleSubmit} onSubmit={handleSubmit}>
				<SettingsSection>
					<SettingsSectionContent>
						{settings.map((setting) => (
							<SettingRenderer setting={setting} key={setting.id} />
						))}
					</SettingsSectionContent>
				</SettingsSection>
			</form>
		</FormProvider>
	);
};
