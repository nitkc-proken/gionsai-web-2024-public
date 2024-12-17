import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PutObjectCommand } from "@aws-sdk/client-s3";
// ProjectDB.jsonとDBを同期させる
import { load } from "js-yaml";
import type { ProjectMap } from "~/generated/types/map.schema";
import { prisma } from "~/util/prisma";
import { minio } from "./lib";
const backet = "content";
const map = load(readFileSync("deploydata/map.yaml").toString()) as ProjectMap;
const path = "./deploydata/ProjectMapImages/";

await Promise.all(
	map.map(async (building, i) => {
		await prisma.building.upsert({
			where: { id: i },
			update: { name: building.building, mapX: building.x, mapY: building.y },
			create: {
				id: i,
				name: building.building,
				mapX: building.x,
				mapY: building.y,
			},
		});
		await Promise.all(
			building.floor.map(async (floor, j) => {
				const id = i * 100 + j + 1;
				const imagePath = resolve(path, floor.image);
				if (!existsSync(imagePath)) {
					throw new Error(`required file not found: ${imagePath}`);
				}
				const sysuser = await prisma.user.findUniqueOrThrow({
					where: {
						email: "system@gionsai.jp",
					},
				});

				const existsImage = await prisma.image.findFirst({
					where: {
						floor: {
							id: id,
						},
					},
				});

				const uuid = existsImage?.id ?? randomUUID();
				const savePath = existsImage?.path ?? `${uuid}.webp`;

				await minio.send(
					new PutObjectCommand({
						Bucket: backet,
						Key: savePath,
						Body: readFileSync(imagePath),
						ContentType: "image/webp",
					}),
				);

				const image = await prisma.image.upsert({
					where: { id: uuid },
					update: {
						path: savePath,
						alt: `${building.building} ${floor?.name ?? ""}地図`,
					},
					create: {
						id: uuid,
						path: savePath,
						alt: `${building.building} ${floor?.name ?? ""}地図`,
						createMember: {
							connect: {
								userId: sysuser.id,
							},
						},
					},
				});

				await prisma.floor.upsert({
					where: { id: id },
					update: { name: floor.name },
					create: {
						id: id,
						name: floor.name,
						buildingId: i,
						mapImageId: image.id,
					},
				});
			}),
		);
	}),
);
