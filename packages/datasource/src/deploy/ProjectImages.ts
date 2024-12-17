import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "~/util/prisma";
import { minio } from "./lib";

console.log("Store ProjectImages.");

const path = "./deploydata/ProjectImages/";

if (!existsSync(path)) throw new Error(`required file not found: ${path}`);
const backet = "content";

const projects = await prisma.project.findMany({
	include: {
		thumbnail: true,
	},
});

for (const project of projects) {
	const imagePath = `${path}${project.alias}.webp`;
	if (!existsSync(imagePath)) {
		if (project.thumbnail) {
			console.log("Master ProjectImage not found: Deleting...");
			await minio.send(
				new DeleteObjectCommand({
					Bucket: backet,
					Key: project.thumbnail.path,
				}),
			);
		}
		console.warn(`Master ProjectImage not found: ${imagePath}`);
		continue;
	}

	const sysuser = await prisma.user.findUniqueOrThrow({
		where: {
			email: "system@gionsai.jp",
		},
	});

	if (project.thumbnail) {
		console.warn(`ProjectImage already exists: ${project.alias}`);
		await minio.send(
			new PutObjectCommand({
				Bucket: backet,
				Key: project.thumbnail.path,
				Body: readFileSync(imagePath),
				ContentType: "image/webp",
			}),
		);
		continue;
	}
	console.info(`ProjectImage uploading... : ${project.alias}`);
	const uuid = randomUUID();
	const savePath = `${uuid}.webp`;

	await minio.send(
		new PutObjectCommand({
			Bucket: backet,
			Key: savePath,
			Body: readFileSync(imagePath),
			ContentType: "image/webp",
		}),
	);

	await prisma.image.create({
		data: {
			id: uuid,
			path: savePath,
			alt: "",
			projects: {
				connect: {
					id: project.id,
				},
			},
			thumbnailProject: {
				connect: {
					id: project.id,
				},
			},

			createMember: {
				connect: {
					userId: sysuser.id,
				},
			},
		},
	});
}
