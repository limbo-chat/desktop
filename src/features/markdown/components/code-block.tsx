import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/button";
import "./code-block.scss";

export interface CodeBlockProps {
	lang: string;
	content: string;
}

interface CopyButtonProps {
	content: string;
}

const CopyButton = ({ content }: CopyButtonProps) => {
	const [copied, setCopied] = useState(false);

	const handleClick = () => {
		navigator.clipboard.writeText(content);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<Button color="secondary" variant="ghost" size="icon" onClick={handleClick}>
			{copied ? <CheckIcon /> : <CopyIcon />}
		</Button>
	);
};

export const CodeBlock = ({ lang, content }: CodeBlockProps) => {
	return (
		<div className="code-block">
			<div className="code-block-header">
				<span>{lang}</span>
				<CopyButton content={content} />
			</div>
			<div className="code-block-body">
				<pre>
					<code className="code-block-code">{content}</code>
				</pre>
			</div>
		</div>
	);
};
