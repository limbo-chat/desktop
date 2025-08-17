import { useMemo, useState } from "react";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
import { AppIcon } from "../../../components/app-icon";
import { CopyIconButton } from "../../../components/copy-icon-button";
import { IconButton } from "../../../components/icon-button";
import { Tooltip } from "../../../components/tooltip";
import { lowlight } from "../lib";

export interface CodeBlockProps {
	lang: string;
	content: string;
}

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
								<AppIcon icon="text" />
							) : (
								<AppIcon icon="text-wrap" />
							)}
						</IconButton>
					</Tooltip>
					<CopyIconButton content={content} />
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
