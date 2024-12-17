import fs from "node:fs";
import { Permissions } from "common/utils/permission";
import xlsx from "xlsx";
import { z } from "zod";
import projects from "~/../deploydata/ProjectDB.json" assert { type: "json" };
import { env } from "~/util/env";
import { prisma } from "~/util/prisma";

xlsx.set_fs(fs);
const target = "./deploydata/DashboardInvites.xlsx";

const dashboardInvitesRowSchema = z.object({
	alias: z.string(),
	name: z.string(),
	url: z.string().url(),
	primaryMail: z.string().email(),
	secondaryMail: z.string().email(),
	teacherMail: z.string().email(),
});
type DashboardInvitesRow = z.infer<typeof dashboardInvitesRowSchema>;

// 招待権限
const permission =
	Permissions.CREATE_NOTIFICATION |
	Permissions.DELETE_NOTIFICATION |
	Permissions.WRITE_PROJECT_INFO |
	Permissions.PROJECT_ADMIN;

const DashboardInvites = await Promise.all(
	projects.map(async (p) => {
		console.log(`Creating invite code for ${p.alias}`);
		const project = await prisma.project.findUniqueOrThrow({
			where: {
				alias: p.alias,
			},
			include: {
				group: {
					include: {
						inviteCodes: {
							where: {
								permission: permission,
							},
							take: 1,
						},
					},
				},
			},
		});

		// 既存の招待コードがあれば削除
		if (project.group.inviteCodes.length > 0) {
			const inviteCode = project.group.inviteCodes[0];
			await prisma.inviteCode.delete({
				where: {
					id: inviteCode.id,
				},
			});
		}

		// 招待コード作成
		const newPermission = await prisma.inviteCode.create({
			data: {
				groupId: project.groupId,
				permission: permission,
				limit: 3,
			},
		});

		return dashboardInvitesRowSchema.parse({
			alias: project.alias,
			name: project.name,
			url: `${env.APP_HOST}/dashboard/invite/${newPermission.code}`,
			primaryMail: p.group.primaryMail,
			secondaryMail: p.group.secondaryMail,
			teacherMail: p.group.teacherMail,
		} satisfies DashboardInvitesRow);
	}),
);

xlsx.writeFileXLSX(
	xlsx.utils.book_new(xlsx.utils.json_to_sheet(DashboardInvites)),
	target,
);
console.log(`Created ${target}`);
