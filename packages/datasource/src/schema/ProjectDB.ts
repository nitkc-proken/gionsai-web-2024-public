import { z } from "zod";

export type RawProjectDBColInput = {
	"666": number;
	申請ID: string | number;
	企画番号: string;
	企画名: string;
	チャンネル名: string;
	団体名: string;
	企画区分: string;
	専門性?: "はい" | "いいえ";
	合同企画?: "はい" | "いいえ";
	パンフレット掲載文: string;
	概要: string;
	詳細?: string;
	企画場所: string;
	"第 1 希望の企画場所": string;
	"第 2 希望の企画場所"?: string;
	"第 3 希望の企画場所"?: string;
	"[代]学科": string;
	"[代]学年"?: number;
	"[代]学籍番号"?: number;
	"[代]メールアドレス": string;
	"[代]姓": string;
	"[代]名": string;
	"[副]学科2": string;
	"[副]学年"?: number;
	"[副]学籍番号"?: number;
	"[副]メールアドレス": string;
	"[副]姓": string;
	"[副]名": string;
	"[教]姓": string;
	"[教]名": string;
	"[教]メールアドレス": string;
	発電機レンタル: "はい" | "いいえ";
	予算上限額: number;
	出展: boolean;
	実行委員会備考?: string;
	学生机?: number;
	学生椅子?: number;
	教壇?: number;
	教卓?: number;
	教員椅子?: number;
	長机?: number;
	暗幕?: number;
	"暗幕(小)"?: number;
	チャネルID: string;
};

export const ProjectSchema = z.object({
	alias: z.string().regex(/^[A-Z]-\d{1,2}$/),
	name: z.string(),
	text: z.string(),
	about: z.string(),
	description: z.string(),
	location: z.string(),
	category: z.enum([
		"専門企画",
		"低学年企画",
		"一般企画",
		"販売企画",
		"食品企画",
		"教職員企画",
		"管理企画",
	]),
	group: z.object({
		name: z.string(),
		primaryMail: z.string().email(),
		secondaryMail: z.string().email(),
		teacherMail: z.string().email(),
	}),
});
