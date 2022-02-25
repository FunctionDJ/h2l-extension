import { Release } from "../../types"
import { getReleasesContent as getReleasesContent } from "./get-releases-contents"
import { downloadText } from "./lib-pure"
import { getLabelsContent } from "./lib-scoped"

chrome.runtime.onConnect.addListener(() => {
  console.log("connected!")
})

const releasesTextarea = document.querySelector<HTMLTextAreaElement>("#releases")
const labelsTextarea = document.querySelector<HTMLTextAreaElement>("#labels")

const artistPatches = [
  { replace: "Dlr", with: "DLR" }
]

const capitalizeThese = ["dj", "mc", "vip"]

chrome.runtime.onMessage.addListener((releases: Release[]) => {
  const releasesContent = getReleasesContent(releases, { capitalizations: capitalizeThese, patches: artistPatches })
  releasesTextarea.value = releasesContent
  downloadText("releases.txt", releasesContent)

  const labelsContent = getLabelsContent(releases, { capitalizations: [], patches: [] })
  labelsTextarea.value = labelsContent
  downloadText("labels.txt", labelsContent)
})