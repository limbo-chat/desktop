import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { IconButton } from "../../../components/icon-button";
import { lowlight } from "../lib";

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
	const lines = useMemo(() => {
		let tree;

		try {
			tree = lowlight.highlight(lang, content, {
				prefix: "token-",
			});
		} catch {
			tree = lowlight.highlight("plaintext", content, {
				prefix: "token-",
			});
		}

		return toJsxRuntime(tree, { Fragment, jsx, jsxs });
	}, [content]);

	return (
		<div className="code-block">
			<div className="code-block-header">
				<span>{lang}</span>
				<CopyButton content={content} />
			</div>
			<div className="code-block-body">
				<pre>
					<code className="code-block-code">{lines}</code>
				</pre>
			</div>
		</div>
	);
};
