import type { Image, PartialProject } from "./project";

export type Building = {
	id: number;
	name: string;
	mapX: number;
	mapY: number;
	floors: Floor[];
};

export type Floor = {
	id: number;
	name: string | null;
	mapImage: Image;
	projects: Omit<PartialProject, "thumbnail">[];
};
