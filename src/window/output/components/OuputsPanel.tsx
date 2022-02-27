import { useEffect, useState } from "preact/hooks";
import { Release } from "../../../../types";
import { getReleasesContent } from "../get-releases-contents";
import { downloadText } from "../lib-pure";
import { getLabelsContent } from "../lib-scoped";
import { useAppState } from "../state";
import { Output } from "./Output";

export const OutputsPanel = () => {
	const [releaseContent, setReleaseContent] = useState("");
	const [labelContent, setLabelContent] = useState("");

	const [state] = useAppState();

	useEffect(() => {
		chrome.runtime.sendMessage("gib-data");

		chrome.runtime.onMessage.addListener((releases: Release[]) => {
			console.log("Content: Got data", releases);

			setReleaseContent(getReleasesContent(releases, state.config.rules.artists));
			setLabelContent(getLabelsContent(releases, state.config.rules.labels));
		});

		if (state.config.autoDownload) {
			downloadText("Releases.txt", releaseContent);
			downloadText("Labels.txt", releaseContent);
		}
	}, []);

	const update = () => {
		chrome.runtime.sendMessage("gib-data");
	};

	return (
		<section style="display: flex; flex-direction: column">
			<div style="display: flex; gap: 1em; align-items: flex-end">
				<h2>Output</h2>
				<button onClick={update}>&#11118; Update now</button>
			</div>
			<Output title="Releases" content={releaseContent}/>
			<Output title="Labels" content={labelContent}/>
		</section>
	);
};