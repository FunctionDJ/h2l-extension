import { Release } from "../types";
import { getPageData } from "../window/beatport";

const getDataOfTab = async (tabId: number) => {
	const injectionResults = await chrome.scripting.executeScript({
		target: { tabId },
		func: getPageData,
		world: "MAIN"
	});

	return injectionResults[0].result;
};

const getReleases = async () => {
	const releasesTabs = await chrome.tabs.query({
		currentWindow: true,
		url: "*://*.beatport.com/release/*"
	});

	const results: Release[] = [];

	for (const tab of releasesTabs) {
		if (tab.id === undefined) {
			throw new Error("encountered tab with no id");
		}

		if (tab.discarded) {
			console.log("reloading tab", tab.id);
			await chrome.tabs.reload(tab.id);
		}

		results.push(await getDataOfTab(tab.id));
	}

	return results;
};

chrome.runtime.onMessage.addListener(async (_message, sender) => {
	if (sender.tab?.id === undefined) {
		return;
	}

	chrome.tabs.sendMessage(sender.tab.id, await getReleases());
});

chrome.action.onClicked.addListener(() => {
	chrome.tabs.create({
		url: "../../content/index.html",
		index: 0
	});
});