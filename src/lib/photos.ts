import { z } from "zod";

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;

export const imageMetadataSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
	filmStock: z.string().optional(),
	camera: z.string().optional(),
	width: z.number().positive().optional(),
	height: z.number().positive().optional(),
	aspectRatio: z.number().positive().optional(),
});

export const mattingSchema = z.object({
	enabled: z.boolean().optional().default(true),
	color: z.string().optional().default("#ffffff"),
	/** Border size as a percent of the shorter image side (lightbox). */
	percent: z.number().min(0).max(50).optional().default(20),
});

export const albumMetadataSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	location: z.string().optional(),
	filmStock: z.string().optional(),
	camera: z.string().optional(),
	matting: mattingSchema.optional(),
	images: z.record(z.string(), imageMetadataSchema).optional(),
});

export type ImageMetadata = z.infer<typeof imageMetadataSchema>;
export type MattingSettings = z.infer<typeof mattingSchema>;
export type AlbumMetadata = z.infer<typeof albumMetadataSchema>;

/** Root prefix in the bucket that mirrors album paths for grid-sized images. */
const THUMBNAIL_PREFIX = "thumbnail";

export type PhotoImage = {
	key: string;
	filename: string;
	url: string;
	/** Smaller derivative under thumbnail/<album>/<file> when present. */
	thumbUrl: string;
	title: string;
	description: string;
	location: string;
	filmStock: string;
	camera: string;
	width: number | null;
	height: number | null;
	aspectRatio: number;
};

export type PhotoAlbum = {
	id: string;
	title: string;
	description: string;
	location: string;
	filmStock: string;
	camera: string;
	matting: {
		enabled: boolean;
		color: string;
		percent: number;
	};
	images: PhotoImage[];
};

export type PhotosResult =
	| { ok: true; albums: PhotoAlbum[]; configured: true }
	| { ok: true; albums: []; configured: false; reason: string }
	| { ok: false; albums: []; configured: boolean; error: string };

const DEFAULT_MATTING = { enabled: true, color: "#ffffff", percent: 20 };
const DEFAULT_ASPECT = 3 / 4;

function publicUrl(base: string, key: string): string {
	const trimmed = base.replace(/\/+$/, "");
	const encoded = key
		.split("/")
		.map((segment) => encodeURIComponent(segment))
		.join("/");
	return `${trimmed}/${encoded}`;
}

function thumbnailKey(originalKey: string): string {
	return `${THUMBNAIL_PREFIX}/${originalKey}`;
}

function humanizeFolder(id: string): string {
	return id
		.replace(/[-_]+/g, " ")
		.replace(/\b\w/g, (c) => c.toUpperCase());
}

function resolveAspect(meta: ImageMetadata | undefined): {
	width: number | null;
	height: number | null;
	aspectRatio: number;
} {
	const width = meta?.width ?? null;
	const height = meta?.height ?? null;
	if (meta?.aspectRatio && meta.aspectRatio > 0) {
		return { width, height, aspectRatio: meta.aspectRatio };
	}
	if (width && height && height > 0) {
		return { width, height, aspectRatio: width / height };
	}
	return { width, height, aspectRatio: DEFAULT_ASPECT };
}

async function readMetadata(
	bucket: R2Bucket,
	prefix: string,
): Promise<AlbumMetadata> {
	const object = await bucket.get(`${prefix}metadata.json`);
	if (!object) return {};

	try {
		const text = await object.text();
		const parsed = albumMetadataSchema.safeParse(JSON.parse(text));
		return parsed.success ? parsed.data : {};
	} catch {
		return {};
	}
}

async function listImages(
	bucket: R2Bucket,
	prefix: string,
	baseUrl: string,
	albumMeta: AlbumMetadata,
): Promise<PhotoImage[]> {
	const images: PhotoImage[] = [];
	let cursor: string | undefined;
	const perImage = albumMeta.images ?? {};

	do {
		const listed = await bucket.list({
			prefix,
			cursor,
			limit: 1000,
		});

		for (const obj of listed.objects) {
			const filename = obj.key.slice(prefix.length);
			if (!filename || filename.includes("/")) continue;
			if (filename.toLowerCase() === "metadata.json") continue;
			if (!IMAGE_EXT.test(filename)) continue;

			const imageMeta = perImage[filename];
			const dims = resolveAspect(imageMeta);

			images.push({
				key: obj.key,
				filename,
				url: publicUrl(baseUrl, obj.key),
				thumbUrl: publicUrl(baseUrl, thumbnailKey(obj.key)),
				title: imageMeta?.title?.trim() || "",
				description: imageMeta?.description?.trim() || "",
				location: imageMeta?.location?.trim() || albumMeta.location?.trim() || "",
				filmStock: imageMeta?.filmStock?.trim() || albumMeta.filmStock?.trim() || "",
				camera: imageMeta?.camera?.trim() || albumMeta.camera?.trim() || "",
				width: dims.width,
				height: dims.height,
				aspectRatio: dims.aspectRatio,
			});
		}

		cursor = listed.truncated ? listed.cursor : undefined;
	} while (cursor);

	images.sort((a, b) => a.filename.localeCompare(b.filename, undefined, { numeric: true }));
	return images;
}

export async function listPhotoAlbums(
	env: Env | undefined,
): Promise<PhotosResult> {
	if (!env?.PHOTOS) {
		return {
			ok: true,
			albums: [],
			configured: false,
			reason: "R2 PHOTOS binding is not available.",
		};
	}

	const baseUrl = (env.PUBLIC_R2_URL ?? "").trim();
	if (!baseUrl) {
		return {
			ok: true,
			albums: [],
			configured: false,
			reason: "Set PUBLIC_R2_URL to your public R2 base URL.",
		};
	}

	try {
		const roots = await env.PHOTOS.list({ delimiter: "/", limit: 1000 });
		const prefixes = (roots.delimitedPrefixes ?? []).map((p) =>
			p.endsWith("/") ? p : `${p}/`,
		);

		const albumPrefixes = prefixes.filter((prefix) => {
			const id = prefix.replace(/\/$/, "");
			return id.toLowerCase() !== THUMBNAIL_PREFIX;
		});

		const albums = await Promise.all(
			albumPrefixes.map(async (prefix) => {
				const id = prefix.replace(/\/$/, "");
				const meta = await readMetadata(env.PHOTOS, prefix);
				const images = await listImages(env.PHOTOS, prefix, baseUrl, meta);
				const matting = {
					enabled: meta.matting?.enabled ?? DEFAULT_MATTING.enabled,
					color: meta.matting?.color?.trim() || DEFAULT_MATTING.color,
					percent: meta.matting?.percent ?? DEFAULT_MATTING.percent,
				};

				return {
					id,
					title: meta.title?.trim() || humanizeFolder(id),
					description: meta.description?.trim() || "",
					location: meta.location?.trim() || "",
					filmStock: meta.filmStock?.trim() || "",
					camera: meta.camera?.trim() || "",
					matting,
					images,
				} satisfies PhotoAlbum;
			}),
		);

		albums.sort((a, b) => a.title.localeCompare(b.title));

		return { ok: true, albums, configured: true };
	} catch (err) {
		const message = err instanceof Error ? err.message : "Failed to list R2 albums.";
		return { ok: false, albums: [], configured: true, error: message };
	}
}

export function uniqueTagValues(
	albums: PhotoAlbum[],
	field: "location" | "filmStock" | "camera",
): string[] {
	const values = new Set<string>();
	for (const album of albums) {
		if (album[field]) values.add(album[field]);
		for (const image of album.images) {
			if (image[field]) values.add(image[field]);
		}
	}
	return [...values].sort((a, b) => a.localeCompare(b));
}
