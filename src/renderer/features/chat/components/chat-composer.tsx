import { ArrowUpIcon, CircleStopIcon } from "lucide-react";
import { useState, type Ref } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../../../components/button";
import { IconButton } from "../../../components/icon-button";
import { PopoverContent, PopoverRoot, PopoverTrigger } from "../../../components/popover";
import { RegisteredLLMPicker } from "../../llms/components/llm-picker";
import { useMaybeLLM } from "../../llms/hooks";
import { ChatToolsMenu } from "./chat-tools-menu";

export interface ChatComposerProps {
	ref?: Ref<HTMLDivElement>;
	isPending: boolean;
	value: string;
	onValueChange: (value: string) => void;
	selectedLLMId: string | null;
	onSelectedLLMIdChange: (id: string) => void;
	enabledToolIds: string[];
	onEnabledToolIdsChange: (ids: string[]) => void;
	onSend: () => void;
	onCancel: () => void;
}

export const ChatComposer = ({
	isPending,
	value,
	onValueChange,
	selectedLLMId,
	onSelectedLLMIdChange,
	enabledToolIds,
	onEnabledToolIdsChange,
	onSend,
	onCancel,
	ref,
}: ChatComposerProps) => {
	const selectedChatLLM = useMaybeLLM(selectedLLMId);
	const [isChatLLMPickerOpen, setIsChatLLMPickerOpen] = useState(false);

	const canSend = value.length > 0;

	const handleSend = () => {
		if (canSend) {
			onSend();
		}
	};

	const handleSubmitClick = () => {
		if (isPending) {
			onCancel();
		} else {
			handleSend();
		}
	};

	return (
		<div className="chat-composer" ref={ref}>
			<form
				className="chat-composer-form"
				onSubmit={(e) => {
					e.preventDefault();

					handleSend();
				}}
			>
				<TextareaAutosize
					autoFocus
					className="chat-composer-input"
					placeholder="Type your message here..."
					value={value}
					onChange={(e) => onValueChange(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();

							if (!isPending) {
								handleSend();
							}
						}
					}}
				/>
				<IconButton
					disabled={!canSend && !isPending}
					onClick={(e) => {
						e.preventDefault();
						handleSubmitClick();
					}}
				>
					{isPending ? <CircleStopIcon /> : <ArrowUpIcon />}
				</IconButton>
			</form>
			<div className="chat-composer-accessories">
				<PopoverRoot open={isChatLLMPickerOpen} onOpenChange={setIsChatLLMPickerOpen}>
					<PopoverTrigger asChild>
						<Button>{selectedChatLLM ? selectedChatLLM.name : "Select llm"}</Button>
					</PopoverTrigger>
					<PopoverContent>
						<RegisteredLLMPicker
							onChange={(selectedId) => {
								onSelectedLLMIdChange(selectedId);
								setIsChatLLMPickerOpen(false);
							}}
						/>
					</PopoverContent>
				</PopoverRoot>
				<ChatToolsMenu
					enabledToolIds={enabledToolIds}
					onEnabledToolIdsChange={onEnabledToolIdsChange}
				/>
			</div>
		</div>
	);
};
