# `common`
[`/packages/common/`](/packages/common/) にはフロントエンド、バックエンド共通の型やユーティリティ関数などを定義する。

## `common/schema`
Zodを使って定義されたスキーマ(データ構造定義)を書く。
フロントエンドとバックエンドで使いやすいように util関数 `schema()`を用意した。

### `schema(errorMessages, zodBuilder)`
Zodのスキーマを定義すると同時に、エラーメッセージを設定する。

```ts
export const exampleSchema = schema(
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
// バックエンド用zodスキーマ
exampleSchema.zod: Z;
// フロントエンド用zodスキーマ
exampleSchema.frontZod: Z;
// エラーメッセージのMap (第一引数と同じ)
exampleSchema.error: EMap;
// ZodのissuesをエラーIDに変換する関数 (変換できなければZodのエラー情報をそのまま返す)
exampleSchema.errorIdOrIssues: (error: InferZodError<Z>) => Error<EID>[];
```
バックエンド側は より短いコードで型安全に定義されたエラーメッセージを返すことができる。
```ts
const validated = c.var.validated.json;
if (!validated.success) {
	return errorResponse(c, validated.errors);
}
const { email, password } = validated.data;
```
フロントエンド側は、Formの実装時に、`exampleSchema.frontZod`を使うだけでFormを簡単に実装できる。
`frontZod`はエラーメッセージを表示用の日本語文字列に設定してある。
### `schema(errorMessages, zodBuilder, schema)`
スキーマを合体する。
以下の例`emailSchema`のように同じスキーマを使い回せる。
```ts
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

export const registerUserSchema = schema(
	{
		invalid_password: "パスワードは8文字以上である必要があります",
		invalid_username: "ユーザー名は空欄にできません",
	},
	(e, imported) =>
		z.object({
			...imported,// ← ここでimportedを使うこと！
			password: z.string().min(8, e.invalid_password),
			username: z.string().min(1, e.invalid_username),
			code: z.string(),
		}),
	{
		email: emailSchema,
	},
);
```

