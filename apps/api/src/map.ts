import { Hono } from "hono";
import { prisma } from "./lib/prisma";
import { imageToResImage } from "./lib/utils/image";

const app = new Hono();

export const mapRoute = app.get("/", async (c) => {
	const buildings = await prisma.building.findMany({
		include: {
			floors: {
				orderBy: {
					id: "asc",
				},
				include: {
					projects: {
						where: {
							visible: true,
						},
						include: {
							group: true,
							category: true,
						},
						orderBy: {
							alias: "asc",
						},
					},
					mapImage: true,
				},
			},
		},
		orderBy: {
			id: "asc",
		},
	});
	return await c.json(
		buildings.map(({ floors, ...b }) => ({
			...b,
			floors: floors.map(({ mapImage, ...f }) => ({
				mapImage: imageToResImage(mapImage),
				...f,
			})),
		})),
	);
});
