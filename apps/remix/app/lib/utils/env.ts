import type { PublicEnv, ServerEnv } from "~/@types/env";

// Server,Client共通で使う環境変数
export const PUBLIC_ENV =
	typeof document === "undefined"
		? typeof process === "undefined"
			? (import.meta.env as unknown as PublicEnv)
			: (process.env as unknown as PublicEnv)
		: window.ENV;

export const SERVER_ENV =
	typeof process !== "undefined"
		? (process.env as unknown as ServerEnv)
		: ({} as ServerEnv);
