import clsx from "clsx";
import { Command } from "cmdk";

export interface SearchPromptProps extends React.ComponentProps<typeof Command> {}

export const SearchPrompt = ({ className, ...props }: SearchPromptProps) => {
	return <Command className={clsx("search-prompt", className)} {...props} />;
};

export interface SearchPromptInputContainerProps extends React.ComponentProps<"div"> {}

export const SearchPromptInputContainer = ({
	className,
	...props
}: SearchPromptInputContainerProps) => {
	return <div className={clsx("search-prompt-input-container", className)} {...props} />;
};

export interface SearchPromptInputProps extends React.ComponentProps<typeof Command.Input> {}

export const SearchPromptInput = ({ className, ...props }: SearchPromptInputProps) => {
	return <Command.Input className={clsx("search-prompt-input", className)} {...props} />;
};

export interface SearchPromptResultsProps extends React.ComponentProps<typeof Command.List> {}

export const SearchPromptResults = ({ className, ...props }: SearchPromptResultsProps) => {
	return <Command.List className={clsx("search-prompt-results", className)} {...props} />;
};

// result items

export interface ResultItemProps extends React.ComponentProps<typeof Command.Item> {}

export const ResultItem = ({ className, ...props }: ResultItemProps) => {
	return <Command.Item className={clsx("result-item")} {...props} />;
};

export interface ResultContentProps extends React.ComponentProps<"div"> {}

export const ResultContent = ({ className, ...props }: ResultContentProps) => {
	return <div className={clsx("result-content")} {...props} />;
};

export interface ResultTitleProps extends React.ComponentProps<"div"> {}

export const ResultTitle = ({ className, ...props }: ResultTitleProps) => {
	return <div className={clsx("result-title")} {...props} />;
};

export interface EmptyResultProps extends React.ComponentProps<"div"> {}

export const EmptyResult = ({ className, ...props }: EmptyResultProps) => {
	return <div className={clsx("empty-result")} {...props} />;
};

// instructions

export interface SearchPromptInstructionsProps extends React.ComponentProps<"div"> {}

export const SearchPromptInstructions = ({
	className,
	...props
}: SearchPromptInstructionsProps) => {
	return <div className={clsx("search-prompt-instructions")} {...props} />;
};

export interface SearchPromptInstructionItemProps extends React.ComponentProps<"div"> {}

export const SearchPromptInstructionItem = ({
	className,
	...props
}: SearchPromptInstructionItemProps) => {
	return <div className="search-prompt-instruction-item" {...props} />;
};

export interface SearchPromptInstructionCommandProps extends React.ComponentProps<"span"> {}

export const SearchPromptInstructionCommand = ({
	className,
	...props
}: SearchPromptInstructionCommandProps) => {
	return <span className="search-prompt-instruction-command" {...props} />;
};

export interface SearchPromptInstructionTextProps extends React.ComponentProps<"span"> {}

export const SearchPromptInstructionText = ({
	className,
	...props
}: SearchPromptInstructionCommandProps) => {
	return <span className="search-prompt-instruction-text" {...props} />;
};
