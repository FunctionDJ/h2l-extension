import { Release, Rules } from "../../types";
import { applyRules, getSharedArtistOfTracks } from "./lib-pure";

export const getArtistsString = (
	release: Release,
	rules: Rules
): string => {
	const artistsNames = release.artists
		.map(ar => applyRules(ar.name, rules))
		.join(", ");

	if (artistsNames.length >= 50) {
		// if all tracks same artist, artist[0], otherwise Various Artists

		const maybeSharedArtist = getSharedArtistOfTracks(release.tracks);

		if (maybeSharedArtist === null) {
			return "Various Artists";
		}

		return applyRules(maybeSharedArtist.name, rules);
	}

	return artistsNames;
};

export const getLabelsContent = (releases: Release[], rules: Rules): string => (
	releases
		.map(r => applyRules(r.label.name, rules))
		.join("\n")
);