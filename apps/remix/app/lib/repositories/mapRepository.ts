import type { Building } from "../types/map";
import { rpc } from "../utils/hc";
import { mock, mockWithArray } from "../utils/mock";

type MapRepository = {
	getMap(): Promise<Building[]>;
};

const MapRepositoryImpl = {
	getMap: async () => {
		const res = await rpc.api.map.$get();
		return await res.json();
	},
} satisfies MapRepository;

const MapRepositoryMock = mockWithArray<Building, MapRepository>(
	"map",
	(db) =>
		({
			getMap: async () => {
				return db;
			},
		}) satisfies MapRepository,
	[
		...Array.from({ length: 3 }, (_, i) => ({
			id: i,
			name: `Building ${i}`,
			mapX: 100,
			mapY: 200,
			floors: Array.from({ length: 3 }, (_, j) => ({
				id: j,
				name: `Floor ${j}`,
				mapImage: {
					id: j.toString(),
					path: "https://placehold.jp/100x100.png",
					alt: `Map ${i}-${j}`,
				},
				projects: Array.from({ length: 3 }, (_, k) => ({
					id: k,
					name: `Project ${k}`,
					description: `Description ${k}`,
					location: `Location ${k}`,
					alias: `Project ${k}`,
					group: {
						id: k,
						name: `Group ${k}`,
					},
					category: {
						id: k,
						name: `Category ${k}`,
						prefix: `C${k}`,
					},
					thumbnail: {
						id: k.toString(),
						path: "https://placehold.jp/100x100.png",
						alt: `Thumbnail ${i}-${j}-${k}`,
					},
				})),
			})),
		})),
	],
);

export const MapRepository = mock(MapRepositoryImpl, MapRepositoryMock);
