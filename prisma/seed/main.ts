import { PrismaClient } from "@prisma/client";
import { createCategory } from "./tables/category";
import { createMember } from "./tables/member";

export const prisma = new PrismaClient();

(async () => {
	console.log("Seeding `Category` table ...");
	await createCategory();

	console.log("Seeding `Member` table ...");
	await createMember();
})()
	.then(async () => {
		await prisma.$disconnect;
	})
	.catch(async (error) => {
		console.error(error);
		await prisma.$disconnect;
		process.exit(1);
	});
