import { BeatportWindow } from "../types"

export const getPageData = () => {
  try {
    const { ProductDetail, Playables } = window as BeatportWindow
    const tracksOfRelease = Playables.tracks.filter(t => t.release.id === ProductDetail.id)
  
    return {
      release: ProductDetail,
      tracksOfRelease
    }
  } catch (error) {
    return `Error: "${JSON.stringify(error)}"`
  }
}
