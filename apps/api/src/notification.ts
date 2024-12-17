import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { prisma } from "~/lib/prisma";

const notification_router = new Hono();

const schema = z.object({
	project: z.string().optional(),
	order: z.union([z.literal("asc"), z.literal("desc")]),
});

export const notificationRoute = notification_router.get(
	"/",
	zValidator("query", schema),
	async (c) => {
		const data = c.req.valid("query");
		if (data.project) {
			const project = await prisma.project.findUnique({
				where: { alias: data.project },
			});
			if (project) {
				const notifications = await prisma.notification.findMany({
					where: {
						project: {
							alias: data.project,
						},
						visible: true,
					},
					include: {
						project: true,
					},
					orderBy: {
						updatedAt: data.order,
					},
				});
				return c.json(
					notifications.map((n) => {
						n.project = project;
						return n;
					}),
				);
			}
			return c.json({ error: "invalid_project_id" }, 400);
		}
		return c.json(
			await prisma.notification.findMany({
				where: { visible: true },
				include: {
					project: true,
				},
				orderBy: {
					updatedAt: data.order,
				},
			}),
		);
	},
);
