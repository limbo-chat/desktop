import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/button";
import "./code-block.scss";

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
		}, 1000);
	};

	return (
		<Button size="icon" color="secondary" onClick={handleClick}>
			{copied ? <CheckIcon size={16} /> : <CopyIcon size={16} />}
		</Button>
	);
};

export const CodeBlock = ({ lang, content }: CodeBlockProps) => {
	return (
		<div className="code-block">
			<div className="code-block__header">
				<span className="code-block-lang">{lang}</span>
				<CopyButton onClick={() => navigator.clipboard.writeText(content)} />
			</div>
			<div className="code-block__content">
				<pre>
					<code className="code-block__code">{content}</code>
				</pre>
			</div>
		</div>
	);
};
