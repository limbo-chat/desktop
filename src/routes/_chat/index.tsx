import { createFileRoute } from "@tanstack/react-router";
import { ArrowUpIcon } from "lucide-react";
import { Button } from "../../components/button";
import { ChatLog } from "../../features/chat/components/chat-log";
import { useForm } from "react-hook-form";
import type { ChatMessageType } from "../../features/chat/types";
import { Sidebar } from "./-components/sidebar";
import "./styles.scss";

export const Route = createFileRoute("/_chat/")({
	component: ChatPage,
});

const testMessages: ChatMessageType[] = [
	{
		id: 1,
		role: "user",
		content: "Hello, how are you?",
	},
	{
		id: 2,
		role: "assistant",
		content: `# Markdown Renderer Test

## Headings

# H1
## H2
### H3
#### H4
##### H5
###### H6

## Text Formatting

**Bold text**  
*Italic text*  
***Bold and Italic text***  
~~Strikethrough~~  
\`Inline code\`  

## Lists

### Unordered List
- Item 1
- Item 2
  - Subitem 2.1
  - Subitem 2.2

### Ordered List
1. First item
2. Second item
   1. Subitem 2.1
   2. Subitem 2.2

## Links

[OpenAI](https://openai.com)

## Images

![Alt text](https://www.calgaryzoo.com/wp-content/uploads/2024/09/DSC01798-1.jpg)

## Blockquotes

> This is a blockquote.
>
> - Nested blockquote

## Code Blocks

\`\`\`javascript
// This is a JavaScript code block
function hello() {
    console.log("Hello, World!", 1 <= 5);
}
\`\`\`

## Tables

| Column 1 | Column 2 | Column 3 |
|----------|----------|----------|
| Row 1    | Data 1   | Data 2   |
| Row 2    | Data 3   | Data 4   |

## Task Lists

- [x] Task 1
- [ ] Task 2
- [ ] Task 3

## Horizontal Rule

---

## Emoji

🚀 🎉 👍 😃

		`,
	},
];

function ChatPage() {
	const form = useForm({
		defaultValues: {
			message: "",
		},
	});

	const onSubmit = form.handleSubmit((data) => {
		console.log(data);

		form.reset();
	});

	return (
		<div className="app-layout">
			<Sidebar />
			<div className="chat-content">
				<div className="chat-log-container">
					<ChatLog className="main-chat-log" messages={testMessages} />
				</div>

				<div className="chat-controls">
					<form className="chat-controls__input-row" onSubmit={onSubmit}>
						<textarea
							className="chat-controls__input"
							placeholder="Type your message here..."
							onKeyDown={(e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();

									onSubmit();
								}
							}}
							{...form.register("message", {
								required: true,
								minLength: 1,
							})}
						/>
						<div>
							<Button type="submit" size="icon" color="secondary">
								<ArrowUpIcon size={20} />
							</Button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
