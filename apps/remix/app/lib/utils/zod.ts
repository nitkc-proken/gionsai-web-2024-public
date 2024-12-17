import type { ZodErrorMap } from "zod";
export const localizedZodErrorMap: ZodErrorMap = (e) => {
	let message: string | undefined = undefined;
	switch (e.code) {
		case "invalid_type":
			message = "必須";
			break;
		case "invalid_literal":
		case "unrecognized_keys":
		case "invalid_union":
		case "invalid_union_discriminator":
		case "invalid_enum_value":
		case "invalid_arguments":
		case "invalid_return_type":
		case "invalid_date":
		case "invalid_string":
		case "too_small":
			message = "文字数が少なすぎます";
			break;
		case "too_big":
			message = "文字数が多すぎます";
			break;
		case "invalid_intersection_types":
		case "not_multiple_of":
		case "not_finite":
		case "custom":
	}
	return { message: message ?? `エラー:${e.code} ${e.message ?? ""}` };
};
