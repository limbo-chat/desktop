import { createFileRoute } from "@tanstack/react-router";
import { MarkdownContainer } from "../../../features/markdown/components/markdown-container";
import { MarkdownRenderer } from "../../../features/markdown/components/markdown-renderer";

export const Route = createFileRoute("/design-playground/elements/markdown")({
	component: MarkdownElementPage,
});

const markdownContent = `

# Markdown playground

See how your custom styles affect this page

---

# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

## Emphasis

*This is italic text*

**This is bold text**

~~Strikethrough~~

[this is a link](https://github.com/limbo-llm)

> This is a blockquote
>> Nested blockquote

## Horizontal rule

---

## Lists

### Unordered

- Lorem ipsum dolor sit amet
- Consectetur adipiscing elit
- Integer molestie lorem at massa

### Orderered

1. Limbo supports custom styles
2. Limbo plugins can override markdown elements
3. Limbo plugins can register tools and models

## Tables

| Option | Description |
| ------ | ----------- |
| data   | path to data files to supply the data that will be passed into templates. |
| engine | engine to be used for processing templates. Handlebars is the default. |
| ext    | extension to be used for dest files. |

## Images
![random image 1](https://picsum.photos/500/300)
![random image 2](https://picsum.photos/500/400)

## Code

### TypeScript land

\`\`\`typescript
// single line comment

/*
	multi line comment
	second line
*/

/**
 * JSDoc comment
 * 
 * @param message - The message to print
 * @returns void
*/

function print(message: string): void {
	console.log(message);
}

const message = \`2 + 2 = \${2 + 2};\`

print(message);
\`\`\`

\`\`\`tsx
/* Remix page */

import { useState } from "react";
import { useLoaderData, type LoaderFunctionArgs } from "react-router";

export function loader(args: LoaderFunctionArgs) {
	const time = new Date().toISOString();

	return {
		time
	}
}

export default function HomePage() {
	const { time } = useLoaderData<typeof loader>();
	const [count, setCount] = useState(0);

	return (
		<div>
			<h1>Welcome to the Home Page</h1>
			<span>Current time: {time}</span>
			<button onClick={() => setCount(prev => prev + 1)}>{count}</button>
		</div>
	);
}
\`\`\`

### Rust land

\`\`\`rust
enum Message {
    Hello,
}

fn main() {
    let msg = Message::Hello;

    match msg {
        Message::Hello => println!("Hello, world!"),
    }
}
\`\`\`

### Python land

\`\`\`python
# this is a comment
def hello_world():
	print("Hello World!")
\`\`\`
`;

function MarkdownElementPage() {
	return (
		<div className="markdown-element-page">
			<MarkdownContainer>
				<MarkdownRenderer content={markdownContent} />
			</MarkdownContainer>
		</div>
	);
}
