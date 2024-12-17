import { S3Client } from "@aws-sdk/client-s3";
import { env } from "~/util/env";

export const minio = new S3Client({
	region: "ap-northeast-1",
	endpoint: env.MINIO_ENDPOINT || "",
	forcePathStyle: true, // MinIO利用時には必要そう。
	credentials: {
		accessKeyId: env.MINIO_USER || "",
		secretAccessKey: env.MINIO_PASSWORD || "",
	},
});
