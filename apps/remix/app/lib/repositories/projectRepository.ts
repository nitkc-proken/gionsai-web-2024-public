import type { Category, PartialProject, ProjectDetail } from "../types/project";
import { rpc } from "../utils/hc";
import { imageFullURL } from "../utils/image";
import { mock, mockWithArray } from "../utils/mock";

type ProjectRepository = {
	listProjects(
		search?: string,
		categoryId?: Category["prefix"],
	): Promise<PartialProject[]>;
	getProject(projectAlias: string): Promise<ProjectDetail | null>;
};

const ProjectRepositoryImpl = {
	listProjects: async (search, categoryId) => {
		const res = await rpc.api.project.$get({
			query: {
				search: search,
				category: categoryId,
			},
		});
		const result = await res.json();
		return result.map(({ thumbnail, ...p }) => ({
			...p,
			thumbnail: thumbnail ? imageFullURL(thumbnail) : null,
		}));
	},
	getProject: async (alias) => {
		const res = await rpc.api.project[":alias"].$get({
			param: {
				alias,
			},
		});
		if (!res.ok) {
			return null;
		}
		const result = await res.json();
		if (!result) {
			return null;
		}
		return {
			...result,
			thumbnail: result.thumbnail ? imageFullURL(result.thumbnail) : null,
			ogpImage: result.ogpImage ? imageFullURL(result.ogpImage) : null,
			images: result.images
				.filter(
					(i) => i.id !== result.ogpImage?.id && i.id !== result.thumbnail?.id,
				)
				.map((image) => imageFullURL(image)),
		};
	},
} satisfies ProjectRepository;

const categories = [
	{
		prefix: "A",
		name: "専門企画",
	},
	{
		prefix: "B",
		name: "低学年企画",
	},
	{
		prefix: "C",
		name: "一般企画",
	},
	{
		prefix: "D",
		name: "販売企画",
	},
	{
		prefix: "E",
		name: "食品企画",
	},
	{
		prefix: "F",
		name: "教職員企画",
	},
] satisfies Category[];
const ProjectRepositoryMock = mockWithArray<ProjectDetail, ProjectRepository>(
	"projects",
	(db) => {
		return {
			listProjects: async (search, categoryId) => {
				return db.filter((project) => {
					return (
						(!categoryId || project.category.prefix === categoryId) &&
						(!search || project.name.includes(search))
					);
				});
			},
			getProject: async (alias) => {
				return db.find((project) => project.alias === alias) ?? null;
			},
		} satisfies ProjectRepository;
	},
	[
		...Array.from({ length: 30 }, (_, i) => {
			const category = categories[i % categories.length];
			return {
				id: i,
				name: `${category.name} ${i}`,
				description: `テスト用${category.name} ${i}`,
				alias: `${category.prefix}-${Math.floor(i / categories.length)}`,
				location: `Location ${i}`,
				floor: {
					id: i,
					building: {
						id: i * 100 + i,
						name: `建物 ${i}`,
					},
					name: `${(i % 4) + 1}階`,
				},
				group: {
					id: i,
					name: `団体 ${i}`,
				},
				category: category,
				thumbnail: null,
				ogpImage: {
					id: `ogp-${i}`,
					path: `https://placehold.jp/3d4070/ffffff/1200x630.png?text=OGP%E7%94%BB%E5%83%8F${i}`,
					alt: `OGP画像 ${i}`,
				},
				images: [],
				notifications: [],
			} satisfies ProjectDetail;
		}),
	],
);

export const ProjectRepository = mock(
	ProjectRepositoryImpl,
	ProjectRepositoryMock,
);
