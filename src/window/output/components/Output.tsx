import { ClipboardButton, DownloadButton } from "./Buttons";
import { downloadText } from "../lib-pure";

interface Props {
  title: string
  content: string
}

export const Output = ({ content, title }: Props) => (
	<>
		<div class="output-sub-headings">
			<h3 style="padding-right: 1em">{title}</h3>
			<ClipboardButton text={content}/>
			<DownloadButton onClick={() => downloadText(title, content)}/>
		</div>
		<textarea value={content} readOnly></textarea>
	</>
);