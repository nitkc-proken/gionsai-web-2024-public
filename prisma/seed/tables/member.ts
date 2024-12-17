import { prisma } from "../main";

//Create System User
export const createMember = async () => {
	await prisma.member.create({
		data: {
			username: "system",
			user: {
				create: {
					email: "system@gionsai.jp",
				},
			},
		},
	});
};
