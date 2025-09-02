import { useEffect } from "react";
import type * as limbo from "@limbo-chat/api";
import { buildNamespacedResourceId } from "../../../lib/utils";
import { addChatNode, removeChatNode } from "../../chat-nodes/utils";
import { addChatPanel, removeChatPanel } from "../../chat-panels/utils";
import { addCommand, removeCommand } from "../../commands/utils";
import { addLLM, removeLLM } from "../../llms/utils";
import { addMarkdownElement, removeMarkdownElement } from "../../markdown/utils";
import { addTool, removeTool } from "../../tools/utils";
import { usePluginManager } from "./core";

export const usePluginSyncLayer = () => {
	const pluginManager = usePluginManager();

	useEffect(() => {
		const handleCommandRegistered = (pluginId: string, command: limbo.Command) => {
			const namespacedCommandId = buildNamespacedResourceId(pluginId, command.id);

			addCommand({
				...command,
				id: namespacedCommandId,
			});
		};

		const handleCommandUnregistered = (pluginId: string, commandId: string) => {
			const namespacedCommandId = buildNamespacedResourceId(pluginId, commandId);

			removeCommand(namespacedCommandId);
		};

		const handleLLMRegistered = (pluginId: string, llm: limbo.LLM) => {
			const namespacedLLMId = buildNamespacedResourceId(pluginId, llm.id);

			addLLM({
				...llm,
				id: namespacedLLMId,
			});
		};

		const handleLLMUnregistered = (pluginId: string, llmId: string) => {
			const namespacedLLMId = buildNamespacedResourceId(pluginId, llmId);

			removeLLM(namespacedLLMId);
		};

		const handleToolRegistered = (pluginId: string, tool: limbo.Tool) => {
			const namespacedToolId = buildNamespacedResourceId(pluginId, tool.id);

			addTool({
				...tool,
				id: namespacedToolId,
			});
		};

		const handleToolUnregistered = (pluginId: string, toolId: string) => {
			const namespacedToolId = buildNamespacedResourceId(pluginId, toolId);

			removeTool(namespacedToolId);
		};

		const handleMarkdownElementRegistered = (
			pluginId: string,
			markdownElement: limbo.ui.MarkdownElement
		) => {
			const namespacedMarkdownElementId = buildNamespacedResourceId(
				pluginId,
				markdownElement.element
			);

			addMarkdownElement(namespacedMarkdownElementId, markdownElement);
		};

		const handleMarkdownElementUnregistered = (pluginId: string, elementId: string) => {
			const namespacedMarkdownElementId = buildNamespacedResourceId(pluginId, elementId);

			removeMarkdownElement(namespacedMarkdownElementId);
		};

		const handleChatNodeRegistered = (pluginId: string, chatNode: limbo.ui.ChatNode) => {
			const namespacedChatNodeId = buildNamespacedResourceId(pluginId, chatNode.id);

			addChatNode(namespacedChatNodeId, chatNode);
		};

		const handleChatNodeUnregistered = (pluginId: string, chatNodeId: string) => {
			const namespacedChatNodeId = buildNamespacedResourceId(pluginId, chatNodeId);

			removeChatNode(namespacedChatNodeId);
		};

		const handleChatPanelRegistered = (pluginId: string, chatPanel: limbo.ui.ChatPanel) => {
			const namespacedChatPanelId = buildNamespacedResourceId(pluginId, chatPanel.id);

			addChatPanel(namespacedChatPanelId, chatPanel);
		};

		const handleChatPanelUnregistered = (pluginId: string, chatPanelId: string) => {
			const namespacedChatPanelId = buildNamespacedResourceId(pluginId, chatPanelId);

			removeChatPanel(namespacedChatPanelId);
		};

		pluginManager.events.on("plugin:command:registered", handleCommandRegistered);
		pluginManager.events.on("plugin:command:unregistered", handleCommandUnregistered);
		pluginManager.events.on("plugin:llm:registered", handleLLMRegistered);
		pluginManager.events.on("plugin:llm:unregistered", handleLLMUnregistered);
		pluginManager.events.on("plugin:tool:registered", handleToolRegistered);
		pluginManager.events.on("plugin:tool:unregistered", handleToolUnregistered);
		pluginManager.events.on(
			"plugin:markdown-element:registered",
			handleMarkdownElementRegistered
		);
		pluginManager.events.on(
			"plugin:markdown-element:unregistered",
			handleMarkdownElementUnregistered
		);
		pluginManager.events.on("plugin:chat-node:registered", handleChatNodeRegistered);
		pluginManager.events.on("plugin:chat-node:unregistered", handleChatNodeUnregistered);
		pluginManager.events.on("plugin:chat-panel:registered", handleChatPanelRegistered);
		pluginManager.events.on("plugin:chat-panel:unregistered", handleChatPanelUnregistered);

		return () => {
			pluginManager.events.off("plugin:command:registered", handleCommandRegistered);
			pluginManager.events.off("plugin:command:unregistered", handleCommandUnregistered);
			pluginManager.events.off("plugin:llm:registered", handleLLMRegistered);
			pluginManager.events.off("plugin:llm:unregistered", handleLLMUnregistered);
			pluginManager.events.off("plugin:tool:registered", handleToolRegistered);
			pluginManager.events.off("plugin:tool:unregistered", handleToolUnregistered);
			pluginManager.events.off(
				"plugin:markdown-element:registered",
				handleMarkdownElementRegistered
			);
			pluginManager.events.off(
				"plugin:markdown-element:unregistered",
				handleMarkdownElementUnregistered
			);
			pluginManager.events.off("plugin:chat-node:registered", handleChatNodeRegistered);
			pluginManager.events.off("plugin:chat-node:unregistered", handleChatNodeUnregistered);
			pluginManager.events.off("plugin:chat-panel:registered", handleChatPanelRegistered);
			pluginManager.events.off("plugin:chat-panel:unregistered", handleChatPanelUnregistered);
		};
	}, []);
};
