import { Release, Rules } from "../../../types";
import { getReleaseSuffix } from "./lib-pure";
import { getArtistsString } from "./lib-scoped";

export const getReleasesContent = (releases: Release[], rules: Rules): string => {
	const releaseLines = releases.map(release => {
		// todo: if artists is empty, output to an error log | note: i think in my data they are always defined
		const artistsString = getArtistsString(release, rules);
		const suffix = getReleaseSuffix(release, release.tracks.length);
		return `${artistsString} - ${release.name}${suffix}`;
	});
  
	return releaseLines.join("\n");
};