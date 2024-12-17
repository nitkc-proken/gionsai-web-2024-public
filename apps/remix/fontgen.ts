import * as fs from "node:fs";
import * as path from "node:path";
const fontsPath = "app/assets/fonts";

const weights = {
	thin: {
		value: 100,
		name: ["Thin"],
	},
	extralight: {
		value: 200,
		name: ["ExtraLight"],
	},
	light: {
		value: 300,
		name: ["Light"],
	},
	normal: {
		value: 350,
		name: ["Normal"],
	},
	regular: {
		value: 400,
		name: ["Regular"],
	},
	medium: {
		value: 500,
		name: ["Medium"],
	},
	semibold: {
		value: 600,
		name: ["SemiBold"],
	},
	bold: {
		value: 700,
		name: ["Bold"],
	},
	extrabold: {
		value: 800,
		name: ["ExtraBold"],
	},
	black: {
		value: 900,
		name: ["Black", "Heavy"],
	},
};
const fontExt = ".woff2";
function extractWeightList(): string[] {
	return Object.values(weights).flatMap((weight) => weight.name);
}

function getWeightFromFilename(filename: string): number {
	const lowercaseFilename = filename.toLowerCase();
	for (const [_, weight] of Object.entries(weights)) {
		for (const weightName of weight.name) {
			if (lowercaseFilename.endsWith(weightName.toLowerCase() + fontExt)) {
				return weight.value;
			}
		}
	}
	throw new Error(`Weight not found in filename: ${filename}`);
	//return 400; // デフォルトのウェイト
}

function getStyleFromFilename(filename: string): string {
	return filename.toLowerCase().includes("italic") ? "italic" : "normal";
}

function getFontFamilyName(filename: string): string {
	// ファイル名からウェイトとスタイルの情報を除去
	extractWeightList()
		.map((w) => w.toLowerCase())
		.join("|");
	const regex = new RegExp(
		String.raw`(-|\s)?(${extractWeightList()
			.map((w) => w.toLowerCase())
			.join("|")})(-|\s)?`,
		"i",
	);
	const familyName = path
		.basename(filename, fontExt)
		.replace(regex, "")
		.replace(/(-|\s)?(italic)(-|\s)?/i, "")
		.trim();

	// 残った文字列を適切なフォントファミリー名に変換（例：kebab-case を PascalCase に）
	//return familyName.split(/[-\s]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
	return familyName.replace("-", " ");
}
interface FontInfo {
	filename: string;
	weight: number;
	style: string;
}

function generateFontFaceCSS(directory: string, srcPrefix?: string): string {
	const files = fs.readdirSync(directory);
	const fontFamilies: { [key: string]: FontInfo[] } = {};

	for (const file of files) {
		if (path.extname(file) === fontExt) {
			const familyName = getFontFamilyName(file);
			const weight = getWeightFromFilename(file);
			const style = getStyleFromFilename(file);

			if (!fontFamilies[familyName]) {
				fontFamilies[familyName] = [];
			}

			fontFamilies[familyName].push({ filename: file, weight, style });
		}
	}

	let css = "";

	for (const [familyName, fonts] of Object.entries(fontFamilies)) {
		css += `\n/* ${familyName} */\n`;
		for (const font of fonts) {
			css += `
@font-face {
  font-family: '${familyName}';
  src: url('${srcPrefix ?? ""}${font.filename}') format('woff2');
  font-weight: ${font.weight};
  font-style: ${font.style};
  font-display: swap;
}
`;
		}
	}

	return css;
}
const targetCSS = "./app/assets/styles/fonts.css";
const cssOutput = generateFontFaceCSS(fontsPath, "../fonts/");
fs.writeFileSync(
	targetCSS,
	`
/* DO NOT EDIT THIS FILE DIRECTLY! */
/* This file is generated by fontgen.ts */

${cssOutput}
`,
);
console.log(`Font CSS generated in ${targetCSS} successfully`);
