import { useMemo } from "react";
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
	value: string;
	onChange: (value: string) => void;
}

const TextSettingRenderer = ({ setting, value, onChange }: TextSettingRendererProps) => {
	if (setting.variant === "password") {
		return (
			<PasswordInput
				placeholder={setting.placeholder}
				value={value ?? ""}
				onChange={(e) => onChange(e.target.value)}
			/>
		);
	}

	return (
		<input
			type="text"
			placeholder={setting.placeholder}
			value={value ?? ""}
			onChange={(e) => onChange(e.target.value)}
		/>
	);
};

interface BooleanSettingRendererProps {
	setting: limbo.BooleanSetting;
	value: boolean;
	onChange: (value: boolean) => void;
}

const BooleanSettingRenderer = ({ setting, value, onChange }: BooleanSettingRendererProps) => {
	return (
		<Checkbox
			checked={value ?? false}
			onCheckedChange={(isChecked) => onChange(isChecked as boolean)}
		/>
	);
};

interface LLMSettingRendererProps {
	setting: limbo.LLMSetting;
	value: string;
	onChange: (llmId: string) => void;
}

const LLMSettingRenderer = ({ setting, value, onChange }: LLMSettingRendererProps) => {
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
		<select onChange={(e) => onChange(e.target.value)} value={value ?? ""}>
			{filteredLLMs.map((llm) => (
				<option value={llm.id} key={llm.id}>
					{llm.name}
				</option>
			))}
		</select>
	);
};

const settingRendererMap = {
	text: TextSettingRenderer,
	boolean: BooleanSettingRenderer,
	llm: LLMSettingRenderer,
} as const;

interface SettingRendererProps {
	setting: limbo.Setting;
	value: any;
	onChange: (value: any) => void;
}

const SettingRenderer = ({ setting, value, onChange }: SettingRendererProps) => {
	const Renderer = settingRendererMap[setting.type];

	console.log(setting, value);

	return (
		<SettingItem>
			<SettingItemInfo>
				<SettingItemTitle>{setting.label}</SettingItemTitle>
				<SettingItemDescription>{setting.description}</SettingItemDescription>
			</SettingItemInfo>
			<SettingItemControl>
				{/* @ts-expect-error idk */}
				<Renderer setting={setting} value={value} onChange={onChange} />
			</SettingItemControl>
		</SettingItem>
	);
};

export interface PluginSettingsSectionProps {
	settings: limbo.Setting[];
	settingValues: Record<string, any>;
	onSettingChange: (id: string, value: any) => void;
}

export const PluginSettingsSection = ({
	settings,
	settingValues,
	onSettingChange,
}: PluginSettingsSectionProps) => {
	return (
		<SettingsSection>
			<SettingsSectionContent>
				{settings.map((setting) => (
					<SettingRenderer
						setting={setting}
						value={settingValues[setting.id]}
						onChange={(value) => onSettingChange(setting.id, value)}
						key={setting.id}
					/>
				))}
			</SettingsSectionContent>
		</SettingsSection>
	);
};
