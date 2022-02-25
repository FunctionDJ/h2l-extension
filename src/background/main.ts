import { getPageData } from "../window/beatport"

const getDataOfTab = async (tabId: number) => {
  const injectionResults = await chrome.scripting.executeScript({
    target: { tabId },
    func: getPageData,
    world: "MAIN"
  })

  return injectionResults[0].result
}

chrome.runtime.onInstalled.addListener(async () => {
  const releasesTabs = await chrome.tabs.query({
    currentWindow: true,
    url: "*://*.beatport.com/release/*"
  })

  const results: any[] = []

  for (const tab of releasesTabs) {
    if (tab.id === undefined) {
      throw new Error("encountered tab with no id")
    }

    if (tab.discarded) {
      console.log("reloading tab", tab.id)
      await chrome.tabs.reload(tab.id)
    }

    results.push(await getDataOfTab(tab.id))
  }

  const outputTab = await chrome.tabs.create({
    url: "../src/window/output.html",
    index: 0
  })

  if (outputTab.id === undefined) {
    throw new Error("output tab id undefined")
  }

  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tabId !== outputTab.id || changeInfo.status !== "complete") {
      return
    }

    chrome.tabs.connect(tabId)
    chrome.tabs.sendMessage(tabId, results)
    console.log(results)
  })
})