import { getPageData } from "../window/beatport"

const getDataOfTab = async (tabId: number) => {
  const injectionResults = await chrome.scripting.executeScript({
    target: { tabId },
    func: getPageData,
    world: "MAIN"
  })

  return injectionResults[0]
}

chrome.runtime.onInstalled.addListener(async () => {
  console.clear()

  const releasesTabs = await chrome.tabs.query({
    currentWindow: true,
    url: "*://*.beatport.com/release/*"
  })

  const results = []

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

  console.log(results)
})