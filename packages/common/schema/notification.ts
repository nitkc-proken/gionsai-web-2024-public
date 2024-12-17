import { z } from "zod";
import { schema } from "./utils/schema";

export const notificationSchema = schema(
	{
		invalid_title: "タイトルは空欄にできません",
		invalid_content: "内容は空欄にできません",
		title_too_long: "タイトルは100文字以下である必要があります",
		content_too_long: "内容は1000文字以下である必要があります",
	},
	(e) =>
		z.object({
			title: z.string().min(1, e.invalid_title).max(100, e.title_too_long),
			content: z
				.string()
				.min(1, e.invalid_content)
				.max(1000, e.content_too_long),
		}),
);
