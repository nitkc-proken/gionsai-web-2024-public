import { prisma } from "../main";

export const createCategory = async () => {
	await prisma.category.createMany({
		data: [
			{ prefix: "A", name: "専門企画" },
			{ prefix: "B", name: "低学年企画" },
			{ prefix: "C", name: "一般企画" },
			{ prefix: "D", name: "販売企画" },
			{ prefix: "E", name: "食品企画" },
			{ prefix: "F", name: "教職員企画" },
			{ prefix: "Z", name: "管理企画" },
		],
	});
};
