import { schema } from "@common/schema/utils/schema";
import { z } from "zod";
const emailSchema = schema(
	{
		invalid_email: "メールアドレスが無効です",
		invalid_email_domain: "メールアドレスのドメインが無効です",
	},
	(e) =>
		z
			.string()
			.email(e.invalid_email)
			.regex(/@([^.]+\.)?kisarazu.ac.jp/, e.invalid_email_domain),
);

export const newPasswordSchema = schema(
	{
		password_too_short: "パスワードは8文字以上である必要があります",
	},
	(e) => z.string().min(8, e.password_too_short),
);

export const loginUserSchema = schema(
	{
		invalid_email: "メールアドレスが無効です",
		invalid_password: "パスワードが無効です",
	},
	(e) =>
		z.object({
			email: z.string().email(e.invalid_email),
			password: z.string().min(1, e.invalid_password),
		}),
);

export const registerUserSchema = schema(
	{
		password_too_short: "パスワードは8文字以上である必要があります",
		username_required: "ユーザー名は空欄にできません",
		invalid_code: "コードは数字のみです",
	},
	(e, imported) =>
		z.object({
			...imported,
			username: z.string().min(1, e.username_required),
			code: z
				.string()
				.length(8)
				.regex(/^[0-9]+$/, e.invalid_code),
		}),
	{
		email: emailSchema,
		password: newPasswordSchema,
	},
);

export const changeUserInfoSchema = schema(
	{
		username_required: "ユーザー名は空欄にできません",
	},
	(e) =>
		z.object({
			username: z.string().min(1, e.username_required),
		}),
);

export const changePasswordSchema = schema(
	{
		username_required: "ユーザー名は空欄にできません",
		invalid_password: "パスワードが無効です",
	},
	(e, imported) =>
		z.object({
			currentPassword: z.string().min(1, e.invalid_password),
			newPassword: imported.newPassword,
		}),
	{
		newPassword: newPasswordSchema,
	},
);

export const verifyEmailSchema = schema(
	{},
	(_e, imported) => z.object(imported),
	{
		email: emailSchema,
	},
);
