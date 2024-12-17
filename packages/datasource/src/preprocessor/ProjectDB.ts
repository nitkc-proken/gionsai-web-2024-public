import { writeFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import xlsx from "xlsx";
import type { z } from "zod";
import { ProjectSchema, type RawProjectDBColInput } from "~/schema/ProjectDB";

import { calcUseCache } from "~/util/fileCache";

import SuperProject from "input/SuperProject.json" assert { type: "json" };

const json = await calcUseCache(
	"ProjectDB-JSON",
	async () => {
		const targetXlsx = "./input/ProjectDB.xlsx";
		const file = await readFile(targetXlsx);
		const workbook = xlsx.read(file);
		const targetSheet = workbook.SheetNames[0];
		return workbook.Sheets[targetSheet];
	},
	async (workbook) => {
		return xlsx.utils.sheet_to_json(workbook) as RawProjectDBColInput[];
	},
);

export const data = await calcUseCache(
	"ProjectDB-MAPPING",
	async () => json,
	async (cacheJson) => {
		const result = cacheJson.map(async (r) => {
			const categoryPrefix = r.企画番号[0];
			// Z-00は本部お知らせ用
			if (!r.出展 || (categoryPrefix === "Z" && r.企画番号 !== "Z-00")) {
				return null;
			}
			const category = r.企画区分 as
				| "専門企画"
				| "低学年企画"
				| "一般企画"
				| "販売企画"
				| "食品企画"
				| "教職員企画"
				| "管理企画";
			const location = r.企画場所.split(" ").pop();
			if (!location) {
				throw new Error(`Invalid location: ${r.企画番号}`);
			}
			const mapped = {
				alias: r.企画番号,
				name: r.企画名,
				text: r.パンフレット掲載文,
				about: r.概要,
				description: r.詳細 ?? "",
				category: category,
				// 食品企画会場 食品企画会場 と表示されてしまうため
				location:
					category === "食品企画" && location === "食品企画会場"
						? ""
						: location,
				group: {
					name: r.団体名,
					primaryMail: r["[代]メールアドレス"],
					secondaryMail: r["[副]メールアドレス"],
					teacherMail: r["[教]メールアドレス"],
				},
			} satisfies z.infer<typeof ProjectSchema>;
			const result = await ProjectSchema.safeParse(mapped);
			if (!result.success) {
				throw new Error(
					`${result.error.errors.map((e) => JSON.stringify(e)).join("\n")}\n${JSON.stringify(mapped, null, 2)}`,
				);
			}
			return result.data;
		});
		const projects = (await Promise.all(result)).filter((p) => p);
		projects.push(ProjectSchema.parse(SuperProject));
		return projects;
	},
);

writeFileSync("./deploydata/ProjectDB.json", JSON.stringify(data, null, 2));
