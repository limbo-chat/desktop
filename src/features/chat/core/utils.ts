import Ajv from "ajv";
import type * as limbo from "limbo";

const ajv = new Ajv();

export interface ExecuteToolCallOptions {
	tool: limbo.Tool;
	args: any;
}

export type ExecuteToolCallResult =
	| { status: "success"; result: string }
	| { status: "error"; error: string | null };

export async function executeToolCall({
	tool,
	args,
}: ExecuteToolCallOptions): Promise<ExecuteToolCallResult> {
	const validateArguments = ajv.compile(tool.schema);
	const areArgumentsValid = validateArguments(args);

	if (!areArgumentsValid) {
		return {
			status: "error",
			error: "Invalid arguments",
		};
	}

	try {
		const result = await tool.execute(args);

		return {
			status: "success",
			result,
		};
	} catch (error) {
		let errorMessage = null;

		if (error instanceof Error) {
			errorMessage = error.message;
		}

		return {
			status: "error",
			error: errorMessage,
		};
	}
}
