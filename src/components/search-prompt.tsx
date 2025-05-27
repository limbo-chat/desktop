import clsx from "clsx";
import type { HTMLAttributes, InputHTMLAttributes } from "react";

export interface SearchPromptProps extends HTMLAttributes<HTMLDivElement> {}

export const SearchPrompt = ({ className, ...props }: SearchPromptProps) => {
	return <div className={clsx("search-prompt", className)} {...props} />;
};

export interface SearchPromptInputContainerProps extends HTMLAttributes<HTMLDivElement> {}

export const SearchPromptInputContainer = ({
	className,
	...props
}: SearchPromptInputContainerProps) => {
	return <div className={clsx("search-prompt-input-container", className)} {...props} />;
};

export interface SearchPromptInputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const SearchPromptInput = ({ className, ...props }: SearchPromptInputProps) => {
	return (
		<input
			className={clsx("search-prompt-input", className)}
			type="text"
			autoComplete="off"
			autoCapitalize="off"
			spellCheck="false"
			enterKeyHint="done"
			{...props}
		/>
	);
};

export interface SearchPromptResultsProps extends HTMLAttributes<HTMLDivElement> {}

export const SearchPromptResults = ({ className, ...props }: SearchPromptResultsProps) => {
	return <div className={clsx("search-prompt-results", className)} tabIndex={-1} {...props} />;
};

export interface SearchPromptInstructionsProps extends HTMLAttributes<HTMLDivElement> {}

export const SearchPromptInstructions = ({
	className,
	...props
}: SearchPromptInstructionsProps) => {
	return <div className={clsx("search-prompt-instructions")} {...props} />;
};

export interface SearchPromptInstructionItemProps extends HTMLAttributes<HTMLDivElement> {}

export const SearchPromptInstructionItem = ({
	className,
	...props
}: SearchPromptInstructionItemProps) => {
	return <div className="search-prompt-instruction-item" {...props} />;
};

export interface SearchPromptInstructionCommandProps extends HTMLAttributes<HTMLSpanElement> {}

export const SearchPromptInstructionCommand = ({
	className,
	...props
}: SearchPromptInstructionCommandProps) => {
	return <span className="search-prompt-instruction-command" {...props} />;
};

export interface SearchPromptInstructionTextProps extends HTMLAttributes<HTMLSpanElement> {}

export const SearchPromptInstructionText = ({
	className,
	...props
}: SearchPromptInstructionCommandProps) => {
	return <span className="search-prompt-instruction-text" {...props} />;
};

// result items

export interface ResultItemProps extends HTMLAttributes<HTMLDivElement> {}

export const ResultItem = ({ className, ...props }: ResultItemProps) => {
	return <div className={clsx("result-item")} {...props} />;
};

export interface ResultContentProps extends HTMLAttributes<HTMLDivElement> {}

export const ResultContent = ({ className, ...props }: ResultContentProps) => {
	return <div className={clsx("result-content")} {...props} />;
};

export interface ResultTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const ResultTitle = ({ className, ...props }: ResultTitleProps) => {
	return <div className={clsx("result-title")} {...props} />;
};

export interface EmptyResultProps extends HTMLAttributes<HTMLDivElement> {}

export const EmptyResult = ({ className, ...props }: EmptyResultProps) => {
	return <div className={clsx("empty-result")} {...props} />;
};
