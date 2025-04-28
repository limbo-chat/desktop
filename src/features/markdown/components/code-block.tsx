import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { IconButton } from "../../../components/icon-button";

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
		<IconButton color="secondary" variant="ghost" onClick={handleClick}>
			{copied ? <CheckIcon /> : <CopyIcon />}
		</IconButton>
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
