type Shared = {
	name: string;
};

export type ReleasesResponseData = {
	results: Release[];
};

export type Release = {
	name: string;
	artists: Shared[];
	track_count: number;
	label: Shared;
};
