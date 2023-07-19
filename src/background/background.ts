import { sendToWindow } from "../rpc";

let accessTokenCache: string | null = null;

async function getAccessToken(): Promise<string> {
	if (typeof accessTokenCache === "string") {
		return accessTokenCache;
	}

	try {
		const response = await fetch("https://www.beatport.com/api/auth/session");
		const json = await response.json();
		const {
			token: { accessToken },
		} = json;

		if (typeof accessToken !== "string" || accessToken.trim().length === 0) {
			throw new Error("Access token missing");
		}

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

	const releaseIds = releasesTabs.map((tab) => {
		const { pathname } = new URL(tab.url!);
		const regexResult = pathname.match(/^\/release\/.+\/(\d+)$/);

		if (regexResult === null || typeof regexResult[1] !== "string") {
			throw new Error(`Could not extract release id of this URL: ${tab.url}`);
		}

		return regexResult[1];
	});

	if (releaseIds.length === 0) {
		return null;
	}

	console.log("releaseIds", releaseIds);

	const accessToken = await getAccessToken();
	console.log("accessToken", accessToken);

	const response = await fetch(
		`https://api.beatport.com/v4/catalog/releases/?id=${releaseIds.join(",")}`,
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
				Accept: "application/json",
			},
		}
	);

	const releasesResponseData = await response.json();
	console.log("releasesResponseData", releasesResponseData);
	return releasesResponseData;
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
