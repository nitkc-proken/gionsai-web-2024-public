import type { ZodError, ZodIssue, ZodType, ZodTypeDef, z } from "zod";
type ErrorID<K> = K | "unknown_error";

type InferZodError<Z> = Z extends ZodType<unknown, ZodTypeDef, infer Input>
	? ZodError<Input>
	: never;

export type Schema<
	EMap extends { [_ in string]: string },
	EID extends keyof EMap,
	Z extends ZodType,
> = {
	// zodスキーマ
	zod: Z;
	frontZod: Z;
	error: EMap;
	// ZodのissuesをエラーのIDに変換する関数
	errorIdOrIssues: (error: InferZodError<Z>) => Error<EID>[];
};

export type SchemaAny = Schema<{ [_ in string]: string }, string, ZodType>;
export type SchemaData<S extends SchemaAny> = z.infer<S["zod"]>;
type Error<EID> = ErrorID<EID> | Pick<ZodIssue, "code" | "path" | "message">;
type SchemaErrorID<S extends SchemaAny> = keyof S["error"];

type ZodBuilderErrorArg<EMap extends { [_ in string]: string }> =
	| EMap
	| { [K in keyof EMap]: K };

// エラーメッセージの定義とスキーマの定義を同時に行う関数
// errorMessages: エラーメッセージの定義
// zodBuilder: エラーメッセージのIDを引数に取り、Zodスキーマを返す関数
export function schema<
	S extends { [_ in string]: SchemaAny },
	const EMap extends { [_ in string]: string } & {
		[_ in SchemaErrorID<S[keyof S]>]?: string;
	},
	OutEMap extends EMap & { [_ in SchemaErrorID<S[keyof S]>]: string },
	EID extends keyof OutEMap,
	Z extends ZodType,
>(
	errorMessages: EMap,
	zodBuilder: (
		error: ZodBuilderErrorArg<OutEMap>,
		schema: { [k in keyof S]: S[k]["frontZod"] },
	) => Z,
	schema: S,
): Schema<OutEMap, EID, Z>;

export function schema<
	const EMap extends { [_ in string]: string },
	EID extends keyof EMap,
	Z extends ZodType,
>(
	errorMessages: EMap,
	zodBuilder: (error: ZodBuilderErrorArg<EMap>) => Z,
): Schema<EMap, EID, Z>;

export function schema<
	S extends { [_ in string]: SchemaAny },
	const EMap extends { [_ in string]: string } & (S extends {
		[_ in string]: SchemaAny;
	}
		? { [_ in SchemaErrorID<S[keyof S]>]?: string }
		: unknown),
	OutEMap extends EMap & { [_ in SchemaErrorID<S[keyof S]>]: string },
	EID extends keyof OutEMap,
	Z extends ZodType,
>(
	errorMessages: EMap,
	zodBuilder: typeof schema extends infer S | undefined
		? (error: ZodBuilderErrorArg<OutEMap>, schema: S) => Z
		: (error: ZodBuilderErrorArg<OutEMap>) => Z,
	schema?: S,
): Schema<OutEMap, EID, Z> {
	const importedSchemaError = schema
		? Object.fromEntries(
				Object.values(schema).flatMap((value) => Object.entries(value.error)),
			)
		: {};
	const mergedErrorMessages = {
		...importedSchemaError,
		...errorMessages,
	} as OutEMap;
	const errIdMap = Object.fromEntries(
		Object.keys(mergedErrorMessages).map((key) => [key, key]),
	) as { [K in keyof OutEMap]: K };
	const zod = schema
		? zodBuilder(
				errIdMap,
				Object.fromEntries(
					Object.entries(schema).map(([key, value]) => [key, value.zod]),
				),
			)
		: zodBuilder(errIdMap, undefined);
	const frontendZod = schema
		? zodBuilder(
				mergedErrorMessages,
				Object.fromEntries(
					Object.entries(schema).map(([key, value]) => [key, value.frontZod]),
				),
			)
		: zodBuilder(mergedErrorMessages, undefined);
	const errorIdOrIssues = (error: InferZodError<Z>) => {
		return error.issues.map((i) => {
			if (!i.message || !Object.keys(mergedErrorMessages).includes(i.message)) {
				return {
					code: i.code,
					path: i.path,
					message: i.message,
				};
			}
			return i.message as EID;
		}) satisfies Error<EID>[];
	};
	return {
		zod: zod,
		frontZod: frontendZod,
		error: mergedErrorMessages,
		errorIdOrIssues: errorIdOrIssues,
	};
}
