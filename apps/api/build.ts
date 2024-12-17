import * as esbuild from "esbuild";
esbuild.buildSync({
	entryPoints: ["src/index.ts"],
	bundle: true,
	platform: "node",
	target: "node20.12",
	external: ["sharp", "@prisma/client", "@node-rs/argon2"],
	outfile: "./dist/server.cjs",
});
