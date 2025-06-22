import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { CheckIcon, CopyIcon, TextIcon, WrapTextIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { IconButton, type IconButtonProps } from "../../../components/icon-button";
import { Tooltip } from "../../../components/tooltip";
import { lowlight } from "../lib";

export interface CodeBlockProps {
	lang: string;
	content: string;
}

interface CopyButtonProps extends Omit<IconButtonProps, "children"> {
	content: string;
}

const CopyButton = ({ content, ...props }: CopyButtonProps) => {
	const [copied, setCopied] = useState(false);

	const handleClick = () => {
		navigator.clipboard.writeText(content);

		setCopied(true);

		setTimeout(() => {
			setCopied(false);
		}, 1000);
	};

	return (
		<IconButton
			className="copy-button"
			data-is-copied={copied ?? undefined}
			onClick={handleClick}
			{...props}
		>
			{copied ? <CheckIcon /> : <CopyIcon />}
		</IconButton>
	);
};

export const CodeBlock = ({ lang, content }: CodeBlockProps) => {
	const [isTextWrapEnabled, setIsTextWrapEnabled] = useState(false);

	const lines = useMemo(() => {
		let tree;

		try {
			tree = lowlight.highlight(lang, content, {
				prefix: "token ",
			});
		} catch {
			tree = lowlight.highlight("plaintext", content, {
				prefix: "token ",
			});
		}

		return toJsxRuntime(tree, { Fragment, jsx, jsxs });
	}, [content]);

	return (
		<div className="code-block" data-lang={lang} data-is-text-wrap-enabled={isTextWrapEnabled}>
			<div className="code-block-header">
				<span className="code-block-language">{lang}</span>
				<div className="code-block-actions">
					<Tooltip
						label={isTextWrapEnabled ? "Disable text wrapping" : "Enable text wrapping"}
					>
						<IconButton
							action="toggle-text-wrap"
							onClick={() => setIsTextWrapEnabled((prev) => !prev)}
						>
							{isTextWrapEnabled ? (
								<TextIcon className="text-icon" />
							) : (
								<WrapTextIcon className="wrap-text-icon" />
							)}
						</IconButton>
					</Tooltip>
					<CopyButton action="copy" content={content} />
				</div>
			</div>
			<div className="code-block-body">
				<pre className="code-block-pre">
					<code className="code-block-code">{lines}</code>
				</pre>
			</div>
		</div>
	);
};
