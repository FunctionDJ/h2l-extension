import { BeatportWindow, Release } from "../types";

export const getPageData = (): Release|string => {
	try {
		const { ProductDetail, Playables } = window as BeatportWindow;
		const tracks = Playables.tracks.filter(t => t.release.id === ProductDetail.id);
  
		return {
			...ProductDetail,
			tracks: tracks
		};
	} catch (error) {
		return `Error: "${JSON.stringify(error)}"`;
	}
};
