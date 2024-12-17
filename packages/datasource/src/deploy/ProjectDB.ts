import { readFileSync } from "node:fs";
import type { Project } from "@prisma/client";
// ProjectDB.jsonとDBを同期させる
import projectsJson from "deploydata/ProjectDB.json" assert { type: "json" };
import { load } from "js-yaml";
import type { ProjectMap } from "~/generated/types/map.schema";
import { prisma } from "~/util/prisma";

const map = load(readFileSync("deploydata/map.yaml").toString()) as ProjectMap;
console.log("Sync ProjectDB.json and DB");

const projects = await prisma.project.findMany({
	include: {
		category: true,
		floor: true,
	},
});

for (const project of projects) {
	let floorIndex = -1;
	const buildingIndex = map.findIndex((b) => {
		floorIndex = b.floor.findIndex((f) => f.projects.includes(project.alias));
		return floorIndex !== -1;
	});
	if (buildingIndex === -1 || floorIndex === -1) {
		console.error(`Project not found in map: ${project.alias}`);
		throw new Error("Project not found in map");
	}
	const floorId = buildingIndex * 100 + floorIndex + 1;

	const projectJsonIndex = projectsJson.findIndex(
		(p) => p.alias === project.alias,
	);

	if (projectJsonIndex === -1) {
		console.warn(`Project not found in JSON: ${project.alias}`);
		console.log("Deleting project...");
		await prisma.project.delete({
			where: {
				alias: project.alias,
			},
		});
		console.warn(`Project deleted: ${project.alias}`);
		continue;
	}
	const checkKeys: [keyof (typeof projectsJson)[number], keyof Project][] = [
		["name", "name"],
		["text", "description"],
		["location", "location"],
	];

	// Update project if any key is different
	if (
		checkKeys.some(
			([jsonKey, key]) =>
				project[key] !== projectsJson[projectJsonIndex][jsonKey],
		) ||
		project.floorId !== floorId
	) {
		console.log(`Updating project: ${project.alias}`);
		await prisma.project.update({
			where: {
				alias: project.alias,
			},
			data: {
				name: projectsJson[projectJsonIndex].name,
				description: projectsJson[projectJsonIndex].text,
				location: projectsJson[projectJsonIndex].location,
				floorId: floorId,
			},
		});
	}
	projectsJson.splice(projectJsonIndex, 1);
}

await Promise.all(
	projectsJson.map(async (project) => {
		const prefix = project.alias.charAt(0);
		console.log(`Creating project: ${project.alias}`);
		let floorIndex = -1;
		const buildingIndex = map.findIndex((b) => {
			floorIndex = b.floor.findIndex((f) => f.projects.includes(project.alias));
			return floorIndex !== -1;
		});
		if (buildingIndex === -1 || floorIndex === -1) {
			console.error(`Project not found in map: ${project.alias}`);
			throw new Error("Project not found in map");
		}
		const floorId = buildingIndex * 100 + floorIndex + 1;
		await prisma.project.create({
			data: {
				name: project.name,
				category: {
					connect: {
						prefix: prefix,
					},
				},
				description: project.text,
				alias: project.alias,
				location: project.location,
				floor: {
					connect: {
						id: floorId,
					},
				},
				visible: prefix !== "Z",
				group: {
					create: {
						name: project.group.name,
						isSuper: false,
					},
				},
			},
		});
	}),
);

console.log("ProjectDB.json and DB synced");
