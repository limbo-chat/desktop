import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../components/button";

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
		<div className="rounded-sm text-sm overflow-hidden">
			<div className="flex items-center justify-between bg-surface-alt px-md py-sm border-b border-border">
				<span>{lang}</span>
				<CopyButton onClick={() => navigator.clipboard.writeText(content)} />
			</div>
			<div className="p-md bg-surface">
				<pre>
					<code className="font-mono">{content}</code>
				</pre>
			</div>
		</div>
	);
};
