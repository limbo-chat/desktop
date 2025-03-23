import { Check, CheckIcon, CopyIcon } from "lucide-react";
import "./code-block.scss";
import { useState } from "react";

export interface CodeBlockProps {
	lang: string;
	content: string;
}

interface CopyButtonProps {
	onClick: () => void;
}

const CopyButton = ({ onClick }: CopyButtonProps) => {
	const [copied, setCopied] = useState(false);

	const handleClick = () => {
		onClick();

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 2500);
	};

	return <button onClick={handleClick}>{copied ? <CheckIcon /> : <CopyIcon />}</button>;
};

export const CodeBlock = ({ lang, content }: CodeBlockProps) => {
	return (
		<div className="code-block">
			<div className="code-block-header">
				<span className="code-block-lang">{lang}</span>
				<CopyButton onClick={() => navigator.clipboard.writeText(content)} />
			</div>
			<div className="code-block-content">
				<pre>
					<code>{content}</code>
				</pre>
			</div>
		</div>
	);
};
