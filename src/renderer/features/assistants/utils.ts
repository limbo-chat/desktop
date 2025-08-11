import handlebars from "handlebars";

export interface RenderSystemPromptContext {
	user: {
		username: string;
	};
}

export function renderSystemPrompt(systemPromptTemplate: string, ctx: RenderSystemPromptContext) {
	const template = handlebars.compile(systemPromptTemplate);

	return template(ctx);
}
