import type { PartialGroup } from "./group";

export type PartialProject = {
	id: number;
	name: string;
	description: string;
	alias: string;
	location: string;
	group: PartialGroup;
	category: Category;
	thumbnail: Image | null;
};
export type Image = {
	id: string;
	path: string;
	alt: string;
};
export type Category = {
	prefix: string;
	name: string;
};

export type ProjectDetail = PartialProject & {
	floor: {
		id: number;
		building: {
			id: number;
			name: string;
		};
		name: string | null;
	};
	ogpImage: Image | null;
	images: Image[];
	notifications: {
		id: number;
		title: string;
		content: string;
		createdAt: string;
		updatedAt: string;
	}[];
};
