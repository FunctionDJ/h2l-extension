import { Release } from "../types";
import { applyRules } from "./lib-pure";
import { Rules } from "./state";

export const getArtistsString = (release: Release, rules: Rules): string => {
	const artistsNames = release.artists
		.map((ar) => applyRules(ar.name, rules))
		.join(", ");

	if (artistsNames.length >= 50) {
		return "Various Artists";
	}

	return artistsNames;
};

export const getLabelsContent = (releases: Release[], rules: Rules): string =>
	releases.map((r) => applyRules(r.label.name, rules)).join("\n");
