// @ts-nocheck

chrome.runtime.onConnect.addListener(() => {
  console.log("connected!")
})

const releasesTextarea = document.getElementById("releases")
const labelsTextarea = document.getElementById("labels")

const getReleaseSuffix = (release, numberOfTracks) => {
  if (/\W[el]p(\s*)?$/i.test(release.name)) { // ends with "LP" or "EP" plus optional trailing spaces
    return ""
  }

  if (numberOfTracks >= 9) {
    return " LP"
  }

  if (numberOfTracks >= 3) {
    return " EP"
  }

  return ""
}

const transformArtist = name => {
  name = name.trim()

  switch (name) {
    case "Dlr": return "DLR"
  }

  return artistFixups(name)
}

const capitalizeThese = ["dj", "mc", "vip"]

/** @param {string} name */
const artistFixups = name => {
  for (const abbr of capitalizeThese) {
    name = name.replace(new RegExp(`\\b${abbr}\\b`, "i"), abbr.toUpperCase())
  }
  return name
}

chrome.runtime.onMessage.addListener(data => {
  releasesTextarea.value = data.map(({ release, tracksOfRelease }) => {
    // todo: if artists is empty, output to an error log | note: i think in my data they are always defined
    const artists = release.artists.map(a => transformArtist(a.name)).join(", ")
    const cappedArtists = artists.length >= 50 ? release.artists[0].name : artists
    const suffix = getReleaseSuffix(release, tracksOfRelease.length)
    return `${cappedArtists} - ${release.name}${suffix}`
  }).join("\n")

  const labels = new Set()

  for (const { release } of data) {
    labels.add(release.label.name)
  }

  labelsTextarea.value = [...labels].join("\n") // also need capitalisation / substitution customization
})