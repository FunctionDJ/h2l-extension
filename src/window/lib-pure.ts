import { Release } from "../types";
import { Rules } from "./state";

export const getReleaseSuffix = (release: Release, numberOfTracks: number) => {
	if (/\W[el]p(\s*)?$/i.test(release.name)) {
		// ends with "LP" or "EP" plus optional trailing spaces
		return "";
	}

	if (numberOfTracks >= 9) {
		return " LP";
	}

	if (numberOfTracks >= 3) {
		return " EP";
	}

	return "";
};

const applyPatches = (text: string, patchRules: Rules["patches"]) => {
	const match = patchRules.find((p) => p.replace === text.trim());

	if (match !== undefined) {
		return match.with;
	}

	return text;
};

/** usually abbreviations like "dj", "mc", "vip" */
const getRegexFromCapRule = (capRule: string) =>
	new RegExp(`\\b${capRule}\\b`, "i");

const applyCapitalizations = (
	text: string,
	capitalizationRules: Rules["capitalizations"]
) => {
	return capitalizationRules.reduce(
		(prev, rule) => prev.replace(getRegexFromCapRule(rule), rule.toUpperCase()),
		text
	);
};

export const applyRules = (text: string, rules: Rules) => {
	const patched = applyPatches(text, rules.patches);
	return applyCapitalizations(patched, rules.capitalizations);
};

export const downloadText = (filename: string, contents: string) => {
	const linkElem = document.createElement("a");
	linkElem.download = filename;

	const file = new Blob([contents], { type: "text/plain" });
	linkElem.href = URL.createObjectURL(file);
	linkElem.click();
};
