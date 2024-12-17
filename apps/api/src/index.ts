import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { csrf } from "hono/csrf";
import type { Session, User } from "lucia";
import { env } from "~/lib/env";
import { notificationRoute } from "~/notification";
import { projectRoute } from "~/project";
import { authRoute } from "./auth";
import { dashboardRoute } from "./dashboard";
import { mapRoute } from "./map";
import { authMiddleware } from "./middleware";

export type Env = {
	Variables: {
		user: User | null;
		session: Session | null;
	};
};
const app = new Hono<Env>().basePath("/api");

app.use(csrf());

const route = app
	.get("/", (c) => {
		return c.text("Hello Hono!");
	})
	.route("/project", projectRoute)
	.route("/map", mapRoute)
	.route("/notifications", notificationRoute)

const port = Number(env.PORT) || 3000;
console.log(`Server is running on port ${port}`);

serve({
	fetch: app.fetch,
	port,
});

export type ApiType = typeof route;
