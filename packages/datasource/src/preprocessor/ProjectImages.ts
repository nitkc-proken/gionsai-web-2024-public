import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync, readFileSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import sharp, { cache } from "sharp";
import { calcUseCache } from "~/util/fileCache";
const path = "./input/ProjectImages/";
const target = "./deploydata/ProjectImages/";

existsSync(target) || mkdirSync(target);

const dir = await readdir(path);
//convert project images to webp ( and resize)
const images = dir.map(async (p) => {
	const imagePath = resolve(path, p);
	await calcUseCache(
		`ProjectImages_${p}`,
		async () => {
			const rs = createReadStream(imagePath);
			const hash = createHash("sha1");
			await pipeline(rs, hash);
			const result = hash.digest("base64");
			return result;
		},
		async () => {
			// extract alias Z-99_ああああ.png to Z-99
			const alias = p.match(/([A-Z]-\d{1,2})_/)?.[1];
			if (!alias) throw new Error(`alias not found in ${p}`);
			await sharp(imagePath)
				.webp()
				.resize(1200, 720, {
					fit: "contain",
					background: { r: 0, g: 0, b: 0, alpha: 0 },
				})
				.toFile(resolve(target, `${alias}.webp`));
			return {};
		},
	);
});

await Promise.all(images);
