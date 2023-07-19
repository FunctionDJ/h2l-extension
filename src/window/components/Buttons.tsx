export const DownloadButton = ({ onClick }: { onClick: () => void }) => (
	<button class="icon" onClick={onClick} title="Download">
    &#x2913;
	</button>
);

export const ClipboardButton = ({ text }: { text: string }) => (
	<button
		class="icon"
		onClick={() => {
			navigator.clipboard.writeText(text);
		}}
		title="Copy to clipboard"
	>
    🔗
	</button>
);

export const AddButton = ({ onClick, text }: { onClick: () => void, text: string }) => (
	<button
		class="add-button with-icon"
		onClick={onClick}
	>
		<span>&#43;</span>
		{text}
	</button>
);

export const RemoveButton = ({ onClick }: { onClick: () => void }) => (
	<button
		class="remove-button"
		onClick={onClick}
	>
    &#x2716;
	</button>
);