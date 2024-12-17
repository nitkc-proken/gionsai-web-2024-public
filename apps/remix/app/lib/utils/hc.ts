import type { ApiType } from "api";
import { hc } from "hono/client";
import { PUBLIC_ENV } from "./env";
import { isUsingMock } from "./mock";

export const rpc = isUsingMock
	? (undefined as unknown as ReturnType<typeof hc<ApiType>>)
	: hc<ApiType>(PUBLIC_ENV.APP_HOST);
