import TextareaAutosize from "react-textarea-autosize";
import { AppIcon } from "../../../components/app-icon";
import { Button } from "../../../components/button";
import { IconButton } from "../../../components/icon-button";
import { useMaybeLLM } from "../../llms/hooks";
import { showLLMPickerModal } from "../../llms/utils";
import { showToolPickerModal } from "../../tools/utils";

export interface ChatComposerProps extends React.ComponentProps<"div"> {
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
					{isPending ? <AppIcon icon="stop" /> : <AppIcon icon="send" />}
				</IconButton>
			</form>
			<div className="chat-composer-accessories">
				<Button
					onClick={() =>
						showLLMPickerModal({
							selectedLLMId,
							onSelect: onSelectedLLMIdChange,
						})
					}
				>
					{selectedChatLLM ? selectedChatLLM.name : "Select llm"}
				</Button>
				<IconButton
					onClick={() => {
						showToolPickerModal({
							initialSelectedToolIds: enabledToolIds,
							onSubmit: onEnabledToolIdsChange,
						});
					}}
				>
					<AppIcon icon="hammer" />
				</IconButton>
			</div>
		</div>
	);
};
