import OpenAI from "openai";
import { publicProcedure, router } from "../trpc";
import { z } from "zod";

const sendMessageInputSchema = z.object({
	message: z.string().min(1),
});

export const chatsRouter = router({
	sendMessage: publicProcedure.input(sendMessageInputSchema).mutation(async ({ input, ctx }) => {
		const openai = new OpenAI({
			// apiKey: "",
		});

		// const completion = await openai.chat.completions.create({
		// 	stream: true,
		// 	model: "o1-mini",
		// 	messages: [
		// 		{ role: "assistant", content: "You are a helpful assistant." },
		// 		{ role: "user", content: input.message },
		// 	],
		// });

		// for await (const chunk of completion) {
		// 	const chunkText = chunk.choices[0]?.delta?.content || "";

		// 	ctx.win.webContents.send("llm-chunk", {
		// 		text: chunkText,
		// 	});
		// }

		return {
			success: true,
		};
	}),
});
