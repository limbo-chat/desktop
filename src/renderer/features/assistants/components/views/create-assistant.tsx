import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../../../components/button";
import { Field } from "../../../../components/field";
import * as FieldController from "../../../../components/field-controller";
import * as Form from "../../../../components/form-primitive";
import {
	SettingItem,
	SettingItemControl,
	SettingItemInfo,
	SettingItemTitle,
} from "../../../../components/settings";
import { Switch } from "../../../../components/switch";
import { usePluginList } from "../../../plugins/hooks/core";
import { useToolList } from "../../../tools/hooks";
import * as View from "../../../view-stack/components/view";
import { useCreateAssistantMutation } from "../../hooks/queries";

interface PluginToggleListProps {
	value: string[];
	onChange: (value: string[]) => void;
}

const PluginToggleList = ({ value, onChange }: PluginToggleListProps) => {
	const plugins = usePluginList();

	return (
		<div className="plugin-list">
			<div className="plugin-list-header">
				<input type="text" className="plugin-list-input" placeholder="Search plugins..." />
			</div>
			<div className="plugin-list-content">
				{plugins.map((plugin) => (
					<SettingItem key={plugin.manifest.id}>
						<SettingItemInfo>
							<SettingItemTitle>{plugin.manifest.name}</SettingItemTitle>
						</SettingItemInfo>
						<SettingItemControl>
							<Switch
								checked={value.includes(plugin.manifest.id)}
								onCheckedChange={(checked) => {
									if (checked) {
										onChange([...value, plugin.manifest.id]);
									} else {
										onChange(
											value.filter(
												(pluginId) => pluginId !== plugin.manifest.id
											)
										);
									}
								}}
							/>
						</SettingItemControl>
					</SettingItem>
				))}
			</div>
		</div>
	);
};

interface ToolToggleListProps {
	value: string[];
	onChange: (value: string[]) => void;
}

const ToolToggleList = ({ value, onChange }: ToolToggleListProps) => {
	const tools = useToolList();

	return (
		<div className="tool-list">
			<div className="tool-list-header">
				<input type="text" className="tool-list-input" placeholder="Search tools..." />
			</div>
			<div className="tool-list-content">
				{tools.map((tool) => (
					<SettingItem key={tool.id}>
						<SettingItemInfo>
							<SettingItemTitle>{tool.id}</SettingItemTitle>
						</SettingItemInfo>
						<SettingItemControl>
							<Switch
								checked={value.includes(tool.id)}
								onCheckedChange={(checked) => {
									if (checked) {
										onChange([...value, tool.id]);
									} else {
										onChange(value.filter((toolId) => toolId !== tool.id));
									}
								}}
							/>
						</SettingItemControl>
					</SettingItem>
				))}
			</div>
		</div>
	);
};

const createAssistantFormSchema = z.object({
	id: z.string().min(1, "ID is required"),
	name: z.string().min(1, "Name is required"),
	description: z.string().min(1, "Description is required"),
	systemPrompt: z.string().min(1, "System prompt is required"),
	recommendedPlugins: z.array(z.string()),
	recommendedTools: z.array(z.string()),
});

export const CreateAssistantView = () => {
	const createAssistantMutation = useCreateAssistantMutation();

	const form = useForm({
		resolver: zodResolver(createAssistantFormSchema),
		defaultValues: {
			name: "",
			description: "",
			systemPrompt: "",
			recommendedPlugins: [],
			recommendedTools: [],
		},
	});

	const handleSubmit = form.handleSubmit((data) => {
		createAssistantMutation.mutate(
			{
				assistant: data,
			},
			{
				onSuccess: () => {},
			}
		);
	});

	return (
		<FormProvider {...form}>
			<View.Root as="form" onSubmit={handleSubmit}>
				<View.Header>
					<View.BackButton type="button" />
					<View.TitleProps>Create assistant</View.TitleProps>
				</View.Header>
				<View.Content>
					<Form.Root as="div" onSubmit={handleSubmit}>
						<Form.Content>
							<FieldController.Root
								id="id"
								name="id"
								label="ID"
								description="Enter a unique ID for your assistant"
							>
								<FieldController.TextInput placeholder="My Assistant" />
							</FieldController.Root>
							<FieldController.Root
								id="name"
								name="name"
								label="Name"
								description="Enter your assistant's name"
							>
								<FieldController.TextInput placeholder="My Assistant" />
							</FieldController.Root>
							<FieldController.Root
								id="description"
								name="description"
								label="Description"
								description="Enter a description"
							>
								<FieldController.TextInput placeholder="A brief description of your assistant" />
							</FieldController.Root>
							<FieldController.Root
								id="system-prompt"
								name="systemPrompt"
								label="System prompt"
								description="Enter a the system prompt for your assistant"
							>
								<FieldController.TextInput placeholder="A brief description of your assistant" />
							</FieldController.Root>
							<Controller
								name="recommendedPlugins"
								render={({ field }) => (
									<Field
										id="recommended-plugins"
										label="Recommended plugins"
										description="Plugins that should be installed to use this assistant"
									>
										<PluginToggleList
											value={field.value}
											onChange={field.onChange}
										/>
									</Field>
								)}
							/>
							<Controller
								name="recommendedTools"
								render={({ field }) => (
									<Field
										id="recommended-tools"
										label="Recommended tools"
										description="Tools that should be used by this assistant"
									>
										<ToolToggleList
											value={field.value}
											onChange={field.onChange}
										/>
									</Field>
								)}
							/>
						</Form.Content>
					</Form.Root>
				</View.Content>
				<View.Footer>
					<View.FooterActions>
						<Button type="submit">Create</Button>
					</View.FooterActions>
				</View.Footer>
			</View.Root>
		</FormProvider>
	);
};
