import { createHash } from "node:crypto";
import { createReadStream, existsSync, mkdirSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import sharp from "sharp";
import { calcUseCache } from "~/util/fileCache";
const path = "./input/ProjectMapImages/";
const target = "./deploydata/ProjectMapImages/";

existsSync(target) || mkdirSync(target);

const dir = await readdir(path);
//convert project images to webp (and resize)
const images = dir.map(async (p) => {
	const imagePath = resolve(path, p);
	await calcUseCache(
		`ProjectMapImages_${p}`,
		async () => {
			const rs = createReadStream(imagePath);
			const hash = createHash("sha1");
			await pipeline(rs, hash);
			const result = hash.digest("base64");
			return result;
		},
		async () => {
			// extract alias Z-99_ああああ.png to Z-99
			const [name, ext] = p.split(".");
			if (ext !== "png") throw new Error(`not .png format: ${p}`);
			await sharp(imagePath)
				.flatten({ background: { r: 255, g: 255, b: 255 } })
				.webp()
				.toFile(resolve(target, `${name}.webp`));
			return {};
		},
	);
});

await Promise.all(images);
