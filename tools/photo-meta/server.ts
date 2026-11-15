import { readdir, readFile, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { imageSize } from "image-size";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";

const IMAGE_EXT = /\.(jpe?g|png|webp)$/i;
const PORT = Number(process.env.PHOTO_META_PORT ?? 8788);

const imageMetaSchema = z.object({
	title: z.string().optional().default(""),
	description: z.string().optional().default(""),
	location: z.string().optional().default(""),
	filmStock: z.string().optional().default(""),
	camera: z.string().optional().default(""),
	width: z.number().positive().optional(),
	height: z.number().positive().optional(),
	aspectRatio: z.number().positive().optional(),
});

const mattingSchema = z.object({
	enabled: z.boolean().optional().default(true),
	color: z.string().optional().default("#ffffff"),
	percent: z.number().min(0).max(50).optional().default(20),
});

const metadataSchema = z.object({
	title: z.string().optional().default(""),
	description: z.string().optional().default(""),
	location: z.string().optional().default(""),
	filmStock: z.string().optional().default(""),
	camera: z.string().optional().default(""),
	matting: mattingSchema.optional().default({
		enabled: true,
		color: "#ffffff",
		percent: 20,
	}),
	images: z.record(z.string(), imageMetaSchema).optional().default({}),
});

type ImageMeta = z.infer<typeof imageMetaSchema>;
type Metadata = z.infer<typeof metadataSchema>;

type ImageRow = {
	filename: string;
	width: number | null;
	height: number | null;
	aspectRatio: number | null;
	meta: ImageMeta;
};

type AlbumRow = {
	id: string;
	folderName: string;
	folderPath: string;
	imageCount: number;
	hasMetadata: boolean;
	metadata: Metadata;
	images: ImageRow[];
};

function resolveRoot(input: string): string {
	const trimmed = input.trim().replace(/^["']|["']$/g, "");
	if (!trimmed) throw new Error("Album root path is required.");
	return path.resolve(trimmed);
}

function humanize(name: string): string {
	return name.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function emptyImageMeta(): ImageMeta {
	return imageMetaSchema.parse({});
}

async function readImageDims(filePath: string): Promise<{
	width: number | null;
	height: number | null;
	aspectRatio: number | null;
}> {
	try {
		const buffer = await readFile(filePath);
		const size = imageSize(buffer);
		if (!size.width || !size.height) {
			return { width: null, height: null, aspectRatio: null };
		}
		return {
			width: size.width,
			height: size.height,
			aspectRatio: Number((size.width / size.height).toFixed(6)),
		};
	} catch {
		return { width: null, height: null, aspectRatio: null };
	}
}

async function loadMetadata(folderPath: string) {
	const metaPath = path.join(folderPath, "metadata.json");
	try {
		const raw = await readFile(metaPath, "utf8");
		const parsed = metadataSchema.safeParse(JSON.parse(raw));
		if (!parsed.success) {
			return { hasMetadata: true, metadata: metadataSchema.parse({}) };
		}
		return { hasMetadata: true, metadata: parsed.data };
	} catch {
		return { hasMetadata: false, metadata: metadataSchema.parse({}) };
	}
}

async function listAlbumImages(
	folderPath: string,
	existing: Record<string, ImageMeta>,
): Promise<ImageRow[]> {
	const entries = await readdir(folderPath, { withFileTypes: true });
	const files = entries
		.filter((entry) => entry.isFile() && IMAGE_EXT.test(entry.name))
		.map((entry) => entry.name)
		.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

	const images = await Promise.all(
		files.map(async (filename) => {
			const dims = await readImageDims(path.join(folderPath, filename));
			const prior = existing[filename] ?? emptyImageMeta();
			const width = dims.width ?? prior.width;
			const height = dims.height ?? prior.height;
			const aspectRatio =
				dims.aspectRatio ??
				prior.aspectRatio ??
				(width && height ? Number((width / height).toFixed(6)) : undefined);

			return {
				filename,
				width: width ?? null,
				height: height ?? null,
				aspectRatio: aspectRatio ?? null,
				meta: {
					...emptyImageMeta(),
					...prior,
					...(width ? { width } : {}),
					...(height ? { height } : {}),
					...(aspectRatio ? { aspectRatio } : {}),
				},
			} satisfies ImageRow;
		}),
	);

	return images;
}

async function scanAlbums(root: string): Promise<AlbumRow[]> {
	const entries = await readdir(root, { withFileTypes: true });
	const folders = entries
		.filter((entry) => entry.isDirectory())
		.sort((a, b) => a.name.localeCompare(b.name));

	return Promise.all(
		folders.map(async (folder) => {
			const folderPath = path.join(root, folder.name);
			const { hasMetadata, metadata } = await loadMetadata(folderPath);
			const images = await listAlbumImages(folderPath, metadata.images ?? {});

			return {
				id: folder.name,
				folderName: folder.name,
				folderPath,
				imageCount: images.length,
				hasMetadata,
				metadata: {
					...metadata,
					title: metadata.title || humanize(folder.name),
					matting: {
						enabled: metadata.matting?.enabled ?? true,
						color: metadata.matting?.color || "#ffffff",
						percent: metadata.matting?.percent ?? 20,
					},
					images: Object.fromEntries(images.map((image) => [image.filename, image.meta])),
				},
				images,
			} satisfies AlbumRow;
		}),
	);
}

function compactImageMeta(meta: ImageMeta): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	if (meta.title?.trim()) out.title = meta.title.trim();
	if (meta.description?.trim()) out.description = meta.description.trim();
	if (meta.location?.trim()) out.location = meta.location.trim();
	if (meta.filmStock?.trim()) out.filmStock = meta.filmStock.trim();
	if (meta.camera?.trim()) out.camera = meta.camera.trim();
	if (meta.width) out.width = meta.width;
	if (meta.height) out.height = meta.height;
	if (meta.aspectRatio) out.aspectRatio = meta.aspectRatio;
	return out;
}

function compactMetadata(metadata: Metadata): Record<string, unknown> {
	const images: Record<string, Record<string, unknown>> = {};
	for (const [filename, meta] of Object.entries(metadata.images ?? {})) {
		const compact = compactImageMeta(imageMetaSchema.parse(meta));
		if (Object.keys(compact).length > 0) images[filename] = compact;
	}

	const payload: Record<string, unknown> = {};
	if (metadata.title.trim()) payload.title = metadata.title.trim();
	if (metadata.description.trim()) payload.description = metadata.description.trim();
	if (metadata.location.trim()) payload.location = metadata.location.trim();
	if (metadata.filmStock.trim()) payload.filmStock = metadata.filmStock.trim();
	if (metadata.camera.trim()) payload.camera = metadata.camera.trim();

	const matting = metadata.matting ?? { enabled: true, color: "#ffffff", percent: 20 };
	payload.matting = {
		enabled: matting.enabled ?? true,
		color: (matting.color || "#ffffff").trim(),
		percent: matting.percent ?? 20,
	};

	if (Object.keys(images).length > 0) payload.images = images;
	return payload;
}

function collectSuggestions(albums: AlbumRow[]) {
	const locations = new Set<string>();
	const filmStocks = new Set<string>();
	const cameras = new Set<string>();

	for (const album of albums) {
		if (album.metadata.location) locations.add(album.metadata.location);
		if (album.metadata.filmStock) filmStocks.add(album.metadata.filmStock);
		if (album.metadata.camera) cameras.add(album.metadata.camera);
		for (const image of album.images) {
			if (image.meta.location) locations.add(image.meta.location);
			if (image.meta.filmStock) filmStocks.add(image.meta.filmStock);
			if (image.meta.camera) cameras.add(image.meta.camera);
		}
	}

	return {
		locations: [...locations].sort(),
		filmStocks: [...filmStocks].sort(),
		cameras: [...cameras].sort(),
	};
}

const app = new Hono();

app.use(
	"/api/*",
	cors({
		origin: ["http://127.0.0.1:5174", "http://localhost:5174"],
	}),
);

app.get("/api/health", (c) => c.json({ ok: true }));

app.get("/api/thumb", async (c) => {
	try {
		const folderPath = resolveRoot(c.req.query("folderPath") ?? "");
		const filename = path.basename(c.req.query("filename") ?? "");
		if (!filename || !IMAGE_EXT.test(filename)) {
			return c.json({ error: "Invalid image filename." }, 400);
		}

		const folderStat = await stat(folderPath);
		if (!folderStat.isDirectory()) {
			return c.json({ error: "Folder path is not a directory." }, 400);
		}

		const filePath = path.join(folderPath, filename);
		const resolvedFile = path.resolve(filePath);
		const resolvedFolder = path.resolve(folderPath);
		if (!resolvedFile.startsWith(resolvedFolder + path.sep)) {
			return c.json({ error: "Invalid image path." }, 400);
		}

		const fileStat = await stat(resolvedFile);
		if (!fileStat.isFile()) {
			return c.json({ error: "Image not found." }, 404);
		}

		const buffer = await readFile(resolvedFile);
		const ext = path.extname(filename).toLowerCase();
		const type =
			ext === ".png" ? "image/png" : ext === ".webp" ? "image/webp" : "image/jpeg";

		return new Response(buffer, {
			headers: {
				"Content-Type": type,
				"Cache-Control": "no-store",
			},
		});
	} catch (err) {
		const message = err instanceof Error ? err.message : "Thumb failed.";
		return c.json({ error: message }, 400);
	}
});

app.post("/api/scan", async (c) => {
	try {
		const body = await c.req.json<{ root?: string }>();
		const root = resolveRoot(body.root ?? "");
		const rootStat = await stat(root);
		if (!rootStat.isDirectory()) {
			return c.json({ error: "Path is not a directory." }, 400);
		}

		const albums = await scanAlbums(root);
		return c.json({ root, albums, suggestions: collectSuggestions(albums) });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Scan failed.";
		return c.json({ error: message }, 400);
	}
});

app.put("/api/metadata", async (c) => {
	try {
		const body = await c.req.json<{
			folderPath?: string;
			metadata?: unknown;
		}>();

		const folderPath = resolveRoot(body.folderPath ?? "");
		const folderStat = await stat(folderPath);
		if (!folderStat.isDirectory()) {
			return c.json({ error: "Folder path is not a directory." }, 400);
		}

		const metadata = metadataSchema.parse(body.metadata ?? {});
		const payload = compactMetadata(metadata);
		const metaPath = path.join(folderPath, "metadata.json");
		await writeFile(metaPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

		return c.json({ ok: true, path: metaPath, metadata: payload });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Write failed.";
		return c.json({ error: message }, 400);
	}
});

app.put("/api/metadata/bulk", async (c) => {
	try {
		const body = await c.req.json<{
			items?: Array<{ folderPath: string; metadata: unknown }>;
		}>();

		const items = body.items ?? [];
		const results = [];

		for (const item of items) {
			const folderPath = resolveRoot(item.folderPath);
			const metadata = metadataSchema.parse(item.metadata ?? {});
			const payload = compactMetadata(metadata);
			const metaPath = path.join(folderPath, "metadata.json");
			await writeFile(metaPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
			results.push({ path: metaPath, metadata: payload });
		}

		return c.json({ ok: true, count: results.length, results });
	} catch (err) {
		const message = err instanceof Error ? err.message : "Bulk write failed.";
		return c.json({ error: message }, 400);
	}
});

serve(
	{
		fetch: app.fetch,
		port: PORT,
	},
	(info) => {
		console.log(`photo-meta API on http://127.0.0.1:${info.port}`);
	},
);
