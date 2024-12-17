import { log } from "node:console";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import {
	brotliCompressSync,
	brotliDecompressSync,
	gzipSync,
	unzipSync,
} from "node:zlib";
import hash from "object-hash";
const cacheLockFile = "./deploydata/cache.json";
// キャッシュファイルがない場合は作成
existsSync(cacheLockFile) || writeFileSync(cacheLockFile, "{}");

const cacheRecord = JSON.parse(readFileSync(cacheLockFile, "utf-8")) as Record<
	string,
	unknown
>;

/**
 * キャッシュを使って計算する
 * @param key キャッシュのキー
 * @param input 計算に使う値
 * @param calc inputに一致するキャッシュがなければinputを使って計算される(高コストな計算)
 * @returns 計算された値, キャッシュがある場合はキャッシュを使う
 */
export async function calcUseCache<I extends {}, T>(
	key: string,
	input: () => Promise<I>,
	calc: (input: I) => Promise<T>,
	shouldUpdate = false,
) {
	// キャッシュを読み込む
	const cache = cacheRecord[key] as
		| {
				hash: string;
				cache: string;
		  }
		| undefined;
	let result: T;

	// 入力値のハッシュを計算
	const inputData = await input();
	const inputHash = `${hash(inputData)}/${hash(calc.toString())}`;
	// 入力値に対応したキャッシュがあるかどうかを確認
	if (!shouldUpdate && cache && cache.hash === inputHash) {
		console.log("Using cache ", key);
		result = decompress(cache.cache);
	} else {
		result = await calc(inputData);
		cacheRecord[key] = {
			hash: inputHash,
			cache: compress(result),
		};
	}
	return result;
}

export function writeCache() {
	writeFileSync(cacheLockFile, JSON.stringify(cacheRecord));
}

// brotili圧縮
function compress(data: unknown) {
	const content = JSON.stringify(data);
	const result = brotliCompressSync(content);
	const value = result.toString("base64");
	return value;
}

// brotili解凍
function decompress<T>(compressed: string) {
	const buffer = Buffer.from(compressed, "base64");
	const result = brotliDecompressSync(buffer).toString("utf-8");
	return JSON.parse(result) as T;
}
