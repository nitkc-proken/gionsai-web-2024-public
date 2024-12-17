const prodEnv = require("./pm2-env.production.json");
module.exports = {
	apps: [
		{
			name: "remix",
			cwd: "./apps/remix/",
			script: "pnpm start",
			env: prodEnv.remix,
		},
		{
			name: "hono-api",
			cwd: "./apps/api/",
			script: "./dist/server.cjs",
		},
	],
};
