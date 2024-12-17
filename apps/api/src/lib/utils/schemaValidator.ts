import type { SchemaAny } from "common/schema/utils/schema";
import type {
	Context,
	Env,
	Input,
	MiddlewareHandler,
	ValidationTargets,
} from "hono";
import { HTTPException } from "hono/http-exception";
import type { StatusCode } from "hono/utils/http-status";
import type { SafeParseReturnType, z } from "zod";

type HasUndefined<T> = undefined extends T ? true : false;

export const schemaInput =
	<
		S extends SchemaAny,
		T extends S["zod"],
		Target extends keyof ValidationTargets,
		E extends Env,
		P extends string,
		In = z.input<T>,
		I extends Input = {
			in: HasUndefined<In> extends true
				? {
						[K in Target]?: K extends "json"
							? In
							: HasUndefined<keyof ValidationTargets[K]> extends true
								? { [K2 in keyof In]?: ValidationTargets[K][K2] }
								: { [K2 in keyof In]: ValidationTargets[K][K2] };
					}
				: {
						[K in Target]: K extends "json"
							? In
							: HasUndefined<keyof ValidationTargets[K]> extends true
								? { [K2 in keyof In]?: ValidationTargets[K][K2] }
								: { [K2 in keyof In]: ValidationTargets[K][K2] };
					};
		},
		V extends I = I,
	>(
		target: Target,
		schema: S,
	): MiddlewareHandler<
		E & {
			Variables: {
				validated: {
					[_ in Target]:
						| {
								success: true;
								data: z.infer<T>;
								errors: never;
						  }
						| {
								success: false;
								data: never;
								errors: ReturnType<S["errorIdOrIssues"]>;
						  };
				};
			};
		},
		P,
		V
	> =>
	async (c, next) => {
		const parseResult = await parseBody(c, schema);
		c.set(
			"validated",
			Object.assign(c.var.validated ?? {}, {
				[target]: parseResult.success
					? {
							success: true,
							data: parseResult.data,
						}
					: {
							success: false,
							errors: schema.errorIdOrIssues(parseResult.error),
						},
			}),
		);
		await next();
	};

// Bodyが無効なJSONでも、適切に400で返す関数
async function parseBody<S extends SchemaAny>(
	c: Context,
	schema: S,
): Promise<SafeParseReturnType<S["zod"]["_input"], S["zod"]["_output"]>> {
	let json: unknown;
	try {
		json = await c.req.json();
	} catch (e) {
		throw new HTTPException(400, {
			message: "invalid_body",
		});
	}
	return schema.zod.safeParse(json);
}

export function errorResponse<const T, const C extends StatusCode>(
	c: Context,
	errors: T,
	code = 400 as C,
) {
	return c.json(
		{
			error: errors,
		},
		code,
	);
}
