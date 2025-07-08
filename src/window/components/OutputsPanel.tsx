import { useEffect, useState } from "preact/hooks";
import {
	ServiceWorkerListener,
	addListenerToServiceWorker,
	removeListenerFromServiceWorker,
} from "../../rpc";
import { getReleasesContent } from "../get-releases-contents";
import { downloadText } from "../lib-pure";
import { getLabelsContent } from "../lib-scoped";
import { useAppState } from "../state";
import { Output } from "./Output";

const messageServiceWorker = () => {
	chrome.runtime.sendMessage("");
};

export const OutputsPanel = () => {
	const [releaseContent, setReleaseContent] = useState("");
	const [labelsContent, setLabelsContent] = useState("");

	const [state] = useAppState();

	useEffect(() => {
		messageServiceWorker();

		const listener: ServiceWorkerListener = (message) => {
			if (message.type === "data") {
				console.log("Content: Got data", message.data);

				const newReleaseContent = getReleasesContent(
					message.data,
					state.config.rules.artists
				);

				setReleaseContent(newReleaseContent);
				const newLabelsContent = getLabelsContent(
					message.data,
					state.config.rules.labels
				);
				setLabelsContent(newLabelsContent);

				if (state.config.autoDownload) {
					downloadText("Releases.txt", newReleaseContent);
					downloadText("Labels.txt", newLabelsContent);
				}
			}
		};

		addListenerToServiceWorker(listener);

		return () => removeListenerFromServiceWorker(listener);
	}, []);

	return (
		<section style="display: flex; flex-direction: column">
			<div style="display: flex; gap: 1em; align-items: flex-end">
				<h2>Output</h2>
				<button onClick={messageServiceWorker}>&#11118; Update now</button>
			</div>
			<Output title="Releases" content={releaseContent} />
			<Output title="Labels" content={labelsContent} />
		</section>
	);
};
