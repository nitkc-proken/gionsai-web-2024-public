import { zValidator } from "@hono/zod-validator";
import type {
	Building,
	Category,
	Floor,
	Group,
	Image,
	Project,
} from "@prisma/client";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "./lib/prisma";
import { imageToResImage } from "./lib/utils/image";

const project_router = new Hono();

const schema = z.object({
	search: z.string().optional(),
	category: z.string().optional(),
});

export const projectRoute = project_router
	.get("/", zValidator("query", schema), async (c) => {
		const data = c.req.valid("query");
		const projects = await prisma.project.findMany({
			where: {
				AND: [
					{
						OR: [
							{ name: { contains: data.search } },
							{ description: { contains: data.search } },
						],
					},
					{ category: { prefix: data.category } },
					{ visible: true },
				],
			},
			include: {
				category: true,
				group: true,
				floor: {
					include: {
						building: true,
					},
				},
				thumbnail: true,
			},
			orderBy: {
				alias: "asc",
			},
		});
		return c.json(projects.map(projectToProjectAbout), 200);
	})
	.get(
		"/:alias",
		zValidator(
			"param",
			z.object({
				alias: z.string(),
			}),
		),
		async (c) => {
			const { alias } = c.req.valid("param");
			const project = await prisma.project.findUnique({
				where: { alias, visible: true },
				include: {
					category: true,
					group: true,
					thumbnail: true,
					ogpImage: true,
					images: true,
					floor: {
						include: {
							building: true,
						},
					},
					notifications: {
						where: {
							visible: true,
						},
					},
				},
			});
			if (!project) {
				return c.json(null, 404);
			}
			return c.json({
				...projectToProjectAbout(project),
				floor: {
					id: project.floor.id,
					building: {
						id: project.floor.building.id,
						name: project.floor.building.name,
					},
					name: project.floor.name,
				},
				ogpImage: project.ogpImage ? imageToResImage(project.ogpImage) : null,
				images: project.images.map(imageToResImage),
				notifications: project.notifications.map((n) => ({
					id: n.id,
					title: n.title,
					content: n.content,
					createdAt: n.createdAt,
					updatedAt: n.updatedAt,
				})),
			});
		},
	);

export function projectToProjectAbout(
	project: Project & {
		category: Category;
		group: Group;
		floor: Floor & { building: Building };
		thumbnail: Image | null;
	},
) {
	return {
		id: project.id,
		name: project.name,
		description: project.description,
		category: project.category,
		location: `${project.floor.building.name} ${project.floor.name ? `${project.floor.name} ` : ""}${project.location}`,
		alias: project.alias,
		group: {
			id: project.group.id,
			name: project.group.name,
		},
		thumbnail: project.thumbnail ? imageToResImage(project.thumbnail) : null,
	};
}
