import { prisma } from "~/util/prisma";
import { minio } from "./lib";

await import("./ProjectMap");
await import("./ProjectDB");
await import("./ProjectImages");
await import("./ProjectOGP");

prisma.$disconnect();
minio.destroy();
