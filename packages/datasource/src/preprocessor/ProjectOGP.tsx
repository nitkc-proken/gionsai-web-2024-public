import {
	createReadStream,
	existsSync,
	mkdirSync,
	readFileSync,
	unlinkSync,
} from "node:fs";

import { createHash } from "node:crypto";
import { resolve } from "node:path";
import { pipeline } from "node:stream/promises";
import satori from "satori";
import sharp from "sharp";
import { getIconCode, loadEmoji } from "~/util/emoji";
import { calcUseCache } from "~/util/fileCache";
import projectsJson from "../../deploydata/ProjectDB.json" assert {
	type: "json",
};

const imageDir = "./deploydata/ProjectImages/";
const outputDir = "./deploydata/ProjectOGP/";
const fontDir = "../../fonts/";
if (!existsSync(imageDir))
	throw new Error(`required file not found: ${imageDir}`);

!existsSync(outputDir) && mkdirSync(outputDir);

await Promise.all(
	projectsJson.map(async (project) => {
		const imagePath = `${imageDir}${project.alias}.webp`;
		await calcUseCache(
			`ProjectOGP_${project.alias}`,
			async () => {
				if (!existsSync(imagePath)) {
					return {};
				}
				const rs = createReadStream(imagePath);
				const hash = createHash("sha1");
				await pipeline(rs, hash);
				const result = hash.digest("base64");
				return result;
			},
			async () => {
				const outPath = resolve(outputDir, `${project.alias}.webp`);
				if (!existsSync(imagePath)) {
					console.warn(`Master ProjectOGP not found: ${imagePath}`);
					if (existsSync(outPath)) {
						console.log("Master ProjectOGP not found: Deleting...");
						unlinkSync(outPath);
					}
					return {};
				}
				const image = await sharp(imagePath).png().toBuffer();
				const base64 = Buffer.from(image).toString("base64");
				const url = `data:image/png;base64,${base64}`;

				const svg = await satori(
					<div
						style={{
							fontFamily: "GenshinGothic",
							width: "1200px",
							height: "630px",
							background: "white",
							display: "flex",
							flexDirection: "column",
							gap: "1rem",
						}}
					>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								padding: "1.5rem 2rem",
							}}
						>
							<h2
								style={{
									fontSize: "2rem",
									fontWeight: "bold",
									margin: "0",
									marginBottom: "0.3rem",
								}}
							>
								{project.group.name}
							</h2>
							<h1
								style={{
									fontSize: "2.5rem",
									fontWeight: "bold",
									margin: "0",
								}}
							>
								{project.name}
							</h1>
							<p
								style={{
									fontSize: "2rem",
									margin: "0",
								}}
							>
								{project.text}
							</p>
						</div>
						<div
							style={{
								flexGrow: 1,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<img
								src={url}
								style={{
									flexGrow: 1,
									// 1200:720 = 5:3
									aspectRatio: "5/3",
									height: "auto",
									objectFit: "contain",
									boxShadow: "0 0 10px rgba(0,0,0,0.5)",
									borderRadius: "30px",
								}}
							/>
						</div>
						<h1
							style={{
								fontFamily: "KiwiMaru",
								margin: "0",
								color: "white",
								padding: "1.5rem 2rem",
								background: "rgb(51 65 85)",
							}}
						>
							木更津高専 祇園祭
						</h1>
					</div>,
					{
						//OGP推奨サイズ
						width: 1200,
						height: 630,
						fonts: [
							{
								name: "GenshinGothic",
								data: readFileSync(
									resolve(fontDir, "GenShinGothic-Normal.ttf"),
								),
								weight: 400,
								style: "normal",
							},
							{
								name: "GenshinGothic",
								data: readFileSync(resolve(fontDir, "GenShinGothic-Bold.ttf")),
								weight: 700,
								style: "normal",
							},
							{
								name: "KiwiMaru",
								data: readFileSync(resolve(fontDir, "KiwiMaru-Regular.ttf")),
								weight: 400,
								style: "normal",
							},
						],
						async loadAdditionalAsset(languageCode, segment) {
							if (languageCode === "emoji") {
								return `data:image/svg+xml;base64,${btoa(await loadEmoji(getIconCode(segment)))}`;
							}
							// 韓国語対応
							return [
								{
									name: "NotoSansCJK",
									data: readFileSync(
										resolve(fontDir, "NotoSansCJKjp-Regular.otf"),
									),
									weight: 400,
									style: "normal",
								},
							];
						},
					},
				);
				await sharp(Buffer.from(svg)).webp().toFile(outPath);
				return true;
			},
		);
	}),
);
