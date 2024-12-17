import type { Image } from "../types/project";
import { SERVER_ENV } from "./env";
export function imageFullURL(image: Image): Image {
	return {
		id: image.id,
		path: (SERVER_ENV.S3_PUBLIC_ENDPOINT??"") + image.path,
		alt: image.alt,
	};
}
