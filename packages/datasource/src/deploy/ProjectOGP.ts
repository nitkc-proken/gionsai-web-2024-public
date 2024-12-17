import { randomUUID } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { prisma } from "~/util/prisma";
import { minio } from "./lib";

const backet = "content";

const path = "./deploydata/ProjectOGP/";

if (!existsSync(path)) throw new Error(`required file not found: ${path}`);

const projects = await prisma.project.findMany({
	include: {
		thumbnail: true,
		ogpImage: true,
	},
});

for (const project of projects) {
	const ogpImagePath = `${path}${project.alias}.webp`;
	if (!existsSync(ogpImagePath)) {
		if (project.ogpImage) {
			console.log("Master ProjectOGP not found: Deleting...");
			await minio.send(
				new DeleteObjectCommand({
					Bucket: backet,
					Key: project.ogpImage.path,
				}),
			);
		}
		console.warn(`Master ProjectOGP not found: ${ogpImagePath}`);
		continue;
	}
	const sysuser = await prisma.user.findUniqueOrThrow({
		where: {
			email: "system@gionsai.jp",
		},
	});

	if (project.ogpImage) {
		console.warn(`ProjectOGP already exists: ${project.alias}`);
		await minio.send(
			new PutObjectCommand({
				Bucket: backet,
				Key: project.ogpImage.path,
				Body: readFileSync(ogpImagePath),
				ContentType: "image/webp",
			}),
		);
		continue;
	}
	console.info(`ProjectOGP uploading... : ${project.alias}`);
	const uuid = randomUUID();
	const savePath = `${uuid}.webp`;

	await minio.send(
		new PutObjectCommand({
			Bucket: backet,
			Key: savePath,
			Body: readFileSync(ogpImagePath),
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
			ogpImageProject: {
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
