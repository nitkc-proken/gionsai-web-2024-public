import type { Image } from "@prisma/client";

export function imageToResImage(image: Image) {
	return {
		id: image.id,
		path: image.path,
		alt: image.alt,
	};
}
