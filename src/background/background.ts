import { sendToWindow } from "../rpc";
import { ReleasesResponseData } from "../types";

let accessTokenCache: string | null = null;

async function getAccessToken(): Promise<string> {
	if (typeof accessTokenCache === "string") {
		return accessTokenCache;
	}

	try {
		const response = await fetch("https://www.beatport.com");
		const text = await response.text();
		const tokenResult = /"access_token":\s?"([\w\-\.]{20,2000})",/i.exec(text);

		if (tokenResult === null) {
			throw new Error("Access token regex failed");
		}

		const accessToken = tokenResult[1];

		accessTokenCache = accessToken;
		return accessToken;
	} catch (error) {
		console.log(error);
		throw new Error("Could not get access token (see service worker console)");
	}
}

async function fetchReleases() {
	const releasesTabs = await chrome.tabs.query({
		currentWindow: true,
		url: "*://*.beatport.com/release/*",
	});

	if (releasesTabs.length === 0) {
		return null;
	}

	releasesTabs[0].index;

	// TODO check in which order we get these

	const releaseTabsWithIds = releasesTabs.map((tab) => {
		const { pathname } = new URL(tab.url === "" ? tab.pendingUrl! : tab.url!);
		const regexResult = pathname.match(/^\/release\/.+\/(\d+)$/);

		if (regexResult === null || typeof regexResult[1] !== "string") {
			throw new Error(`Could not extract release id of this URL: ${tab.url}`);
		}

		return {
			tab,
			releaseId: Number.parseInt(regexResult[1], 10),
		};
	});

	const accessToken = await getAccessToken();
	console.log("accessToken", accessToken);

	const releaseIdsInBatchesOfTen = releaseTabsWithIds.reduce<number[][]>(
		(prev, { releaseId }) => {
			const last = prev.at(-1);

			if (last === undefined || last.length >= 10) {
				return [...prev, [releaseId]];
			}

			last.push(releaseId);
			return prev;
		},
		[]
	);

	let results: ReleasesResponseData["results"] = [];

	for (const releaseIds of releaseIdsInBatchesOfTen) {
		const response = await fetch(
			`https://api.beatport.com/v4/catalog/releases/?id=${releaseIds.join(
				","
			)}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
					Accept: "application/json",
				},
			}
		);

		const releasesResponseData =
			(await response.json()) as ReleasesResponseData;
		console.log("releasesResponseData", releasesResponseData);
		results.push(...releasesResponseData.results);
	}

	releaseTabsWithIds.sort((a, b) => (a.tab.index < b.tab.index ? -1 : 1));

	return releaseTabsWithIds.map(({ releaseId }) => {
		const release = results.find((r) => r.id === releaseId);

		if (release === undefined) {
			throw new Error(
				`Couldn't find release with id ${releaseId} in the returned release data from the beatport API`
			);
		}

		return release;
	});
}

chrome.runtime.onMessage.addListener(async (_message, sender) => {
	console.log("got message from window");

	if (sender.tab?.id === undefined) {
		return;
	}

	try {
		const releases = await fetchReleases();

		if (releases !== null) {
			sendToWindow(sender.tab.id, {
				type: "data",
				data: releases,
			});
		}
	} catch (error) {
		sendToWindow(sender.tab.id, {
			type: "error",
			message: error instanceof Error ? error.message : JSON.stringify(error),
		});

		throw error;
	}
});

chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({
		url: "../../content/index.html",
	});
});
