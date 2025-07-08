import { ReleasesResponseData } from "./types";

type ServiceWorkerMessage =
	| {
			type: "data";
			data: ReleasesResponseData["results"];
	  }
	| {
			type: "error";
			message: string;
	  };

export function sendToWindow(tabId: number, message: ServiceWorkerMessage) {
	chrome.tabs.sendMessage(tabId, message);
}

export type ServiceWorkerListener = (
	message: ServiceWorkerMessage,
	sender: chrome.runtime.MessageSender,
	sendResponse: (response?: any) => void
) => void;

export function addListenerToServiceWorker(listener: ServiceWorkerListener) {
	chrome.runtime.onMessage.addListener(listener);
}

export function removeListenerFromServiceWorker(
	listener: ServiceWorkerListener
) {
	chrome.runtime.onMessage.removeListener(listener);
}
