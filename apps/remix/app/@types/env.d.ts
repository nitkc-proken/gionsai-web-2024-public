// 公開する環境変数
export const PublicEnvs = ["APP_HOST", "USE_MOCK", "DEBUG_DATE"] as const;

type PublicEnvNames = (typeof PublicEnvs)[number];
export type PublicEnv = {
	[K in PublicEnvNames]: string;
};

const ServerEnvs = ["S3_PUBLIC_ENDPOINT"] as const;
type ServerEnvNames = (typeof ServerEnvs)[number];
export type ServerEnv = {
	[K in ServerEnvNames]: string;
};
