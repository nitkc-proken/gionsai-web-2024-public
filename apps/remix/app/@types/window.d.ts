import type { PublicEnv } from "./env";

//windowから環境変数を読めるようにする。
declare global {
	interface Window {
		ENV: PublicEnv;
	}
}
