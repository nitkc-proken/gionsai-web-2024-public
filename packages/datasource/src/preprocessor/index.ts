import { writeCache } from "~/util/fileCache";

await import("./ProjectDB");
writeCache();
await import("./ProjectImages");
writeCache();
await import("./ProjectMapImages");
writeCache();
await import("./ProjectOGP");
writeCache();
