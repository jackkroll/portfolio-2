import "./style.css";

type ImageMeta = {
	title: string;
	description: string;
	location: string;
	filmStock: string;
	camera: string;
	width?: number;
	height?: number;
	aspectRatio?: number;
};

type Metadata = {
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
	images: Record<string, ImageMeta>;
};

type ImageRow = {
	filename: string;
	width: number | null;
	height: number | null;
	aspectRatio: number | null;
	meta: ImageMeta;
};

type Album = {
	id: string;
	folderName: string;
	folderPath: string;
	imageCount: number;
	hasMetadata: boolean;
	metadata: Metadata;
	images: ImageRow[];
};

type ScanResponse = {
	root: string;
	albums: Album[];
	suggestions: {
		locations: string[];
		filmStocks: string[];
		cameras: string[];
	};
	error?: string;
};

const appEl = document.querySelector<HTMLDivElement>("#app");
if (!appEl) throw new Error("#app missing");
const app: HTMLDivElement = appEl;

let albums: Album[] = [];
let suggestions = {
	locations: [] as string[],
	filmStocks: [] as string[],
	cameras: [] as string[],
};
let openAlbum = new Set<number>();

function escapeHtml(value: string): string {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

function datalist(id: string, values: string[]): string {
	return `<datalist id="${id}">${values.map((v) => `<option value="${escapeHtml(v)}"></option>`).join("")}</datalist>`;
}

function thumbUrl(folderPath: string, filename: string): string {
	const params = new URLSearchParams({ folderPath, filename });
	return `/api/thumb?${params.toString()}`;
}

function syncAlbumImages(album: Album) {
	album.metadata.images = Object.fromEntries(
		album.images.map((image) => [
			image.filename,
			{
				...image.meta,
				...(image.width ? { width: image.width } : {}),
				...(image.height ? { height: image.height } : {}),
				...(image.aspectRatio ? { aspectRatio: image.aspectRatio } : {}),
			},
		]),
	);
}

function render(statusText = "", statusKind: "" | "ok" | "error" = "") {
	app.innerHTML = `
		<main>
			<h1>Photo metadata</h1>
			<p class="lede">
				Scan a local album root. Dimensions/aspect ratios are read automatically.
				Album fields are defaults; expand an album to override tags per image.
				Save writes <code>metadata.json</code> for R2 upload.
			</p>

			<section class="panel">
				<div class="row">
					<label>
						Album root path
						<input id="root" type="text" placeholder="C:\\Photos\\2024" autocomplete="off" />
					</label>
					<button type="button" id="scan">Scan folders</button>
					<button type="button" class="secondary" id="save-all" ${albums.length ? "" : "disabled"}>Save all</button>
				</div>
				<p class="status ${statusKind}" id="status">${escapeHtml(statusText)}</p>
			</section>

			${datalist("locations", suggestions.locations)}
			${datalist("film-stocks", suggestions.filmStocks)}
			${datalist("cameras", suggestions.cameras)}

			<section class="album-list">
				${
					albums.length === 0
						? `<p class="status">No albums loaded yet.</p>`
						: albums
								.map((album, index) => {
									const expanded = openAlbum.has(index);
									return `
					<article class="album" data-index="${index}">
						<div class="album-head">
							<div>
								<h2>${escapeHtml(album.folderName)}</h2>
								<p class="meta">${album.imageCount} image${album.imageCount === 1 ? "" : "s"} · ${album.hasMetadata ? "has metadata" : "no metadata yet"}</p>
							</div>
							<button type="button" class="secondary" data-toggle="${index}">${expanded ? "Hide images" : "Edit images"}</button>
						</div>

						<div class="fields">
							<label>Title<input data-album-field="title" value="${escapeHtml(album.metadata.title)}" /></label>
							<label class="wide">Description<textarea data-album-field="description" rows="2">${escapeHtml(album.metadata.description)}</textarea></label>
							<label>Location default<input data-album-field="location" list="locations" value="${escapeHtml(album.metadata.location)}" /></label>
							<label>Film stock default<input data-album-field="filmStock" list="film-stocks" value="${escapeHtml(album.metadata.filmStock)}" /></label>
							<label>Camera default<input data-album-field="camera" list="cameras" value="${escapeHtml(album.metadata.camera)}" /></label>
						</div>

						<div class="matting fields">
							<label class="check">
								<span>Lightbox matting</span>
								<input type="checkbox" data-matting="enabled" ${album.metadata.matting.enabled ? "checked" : ""} />
							</label>
							<label>Matte color<input data-matting="color" type="text" value="${escapeHtml(album.metadata.matting.color)}" /></label>
							<label>Matte %<input data-matting="percent" type="number" min="0" max="50" value="${album.metadata.matting.percent}" /></label>
						</div>

						${
							expanded
								? `<div class="image-list">
							${album.images
								.map(
									(image, imageIndex) => `
								<details class="image-row">
									<summary>
										<span class="thumb-box" aria-hidden="true">
											<img src="${escapeHtml(thumbUrl(album.folderPath, image.filename))}" alt="" loading="lazy" decoding="async" />
										</span>
										<span class="image-row__copy">
											<strong>${escapeHtml(image.filename)}</strong>
											<span class="meta">${image.width && image.height ? `${image.width}×${image.height}` : "size unknown"}${image.aspectRatio ? ` · ${image.aspectRatio.toFixed(3)}` : ""}</span>
										</span>
									</summary>
									<div class="image-row__body">
										<span class="thumb-box thumb-box--lg" aria-hidden="true">
											<img src="${escapeHtml(thumbUrl(album.folderPath, image.filename))}" alt="" loading="lazy" decoding="async" />
										</span>
										<div class="fields">
											<label>Title<input data-image="${imageIndex}" data-image-field="title" value="${escapeHtml(image.meta.title)}" placeholder="Uses filename on site if empty" /></label>
											<label class="wide">Description<textarea data-image="${imageIndex}" data-image-field="description" rows="2">${escapeHtml(image.meta.description)}</textarea></label>
											<label>Location<input data-image="${imageIndex}" data-image-field="location" list="locations" value="${escapeHtml(image.meta.location)}" placeholder="Album default" /></label>
											<label>Film stock<input data-image="${imageIndex}" data-image-field="filmStock" list="film-stocks" value="${escapeHtml(image.meta.filmStock)}" placeholder="Album default" /></label>
											<label>Camera<input data-image="${imageIndex}" data-image-field="camera" list="cameras" value="${escapeHtml(image.meta.camera)}" placeholder="Album default" /></label>
										</div>
									</div>
								</details>
							`,
								)
								.join("")}
						</div>`
								: ""
						}

						<div class="actions">
							<button type="button" data-save="${index}">Save metadata.json</button>
						</div>
					</article>
				`;
								})
								.join("")
				}
			</section>
		</main>
	`;

	bindEvents();
}

function bindEvents() {
	document.getElementById("scan")?.addEventListener("click", () => void scan());
	document.getElementById("save-all")?.addEventListener("click", () => void saveAll());

	app.querySelectorAll<HTMLButtonElement>("[data-toggle]").forEach((button) => {
		button.addEventListener("click", () => {
			const index = Number(button.dataset.toggle);
			if (openAlbum.has(index)) openAlbum.delete(index);
			else openAlbum.add(index);
			const root = (document.getElementById("root") as HTMLInputElement)?.value ?? "";
			render();
			if (document.getElementById("root")) {
				(document.getElementById("root") as HTMLInputElement).value = root;
			}
		});
	});

	app.querySelectorAll<HTMLButtonElement>("[data-save]").forEach((button) => {
		button.addEventListener("click", () => void saveOne(Number(button.dataset.save)));
	});

	app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-album-field]").forEach((input) => {
		input.addEventListener("input", () => {
			const article = input.closest<HTMLElement>(".album");
			if (!article) return;
			const index = Number(article.dataset.index);
			const field = input.dataset.albumField as keyof Pick<
				Metadata,
				"title" | "description" | "location" | "filmStock" | "camera"
			>;
			albums[index].metadata[field] = input.value;
		});
	});

	app.querySelectorAll<HTMLInputElement>("[data-matting]").forEach((input) => {
		input.addEventListener("input", () => {
			const article = input.closest<HTMLElement>(".album");
			if (!article) return;
			const index = Number(article.dataset.index);
			const field = input.dataset.matting;
			if (field === "enabled") albums[index].metadata.matting.enabled = input.checked;
			if (field === "color") albums[index].metadata.matting.color = input.value;
			if (field === "percent") albums[index].metadata.matting.percent = Number(input.value || 0);
		});
		input.addEventListener("change", () => {
			const article = input.closest<HTMLElement>(".album");
			if (!article) return;
			const index = Number(article.dataset.index);
			if (input.dataset.matting === "enabled") {
				albums[index].metadata.matting.enabled = input.checked;
			}
		});
	});

	app.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[data-image-field]").forEach((input) => {
		input.addEventListener("input", () => {
			const article = input.closest<HTMLElement>(".album");
			if (!article) return;
			const albumIndex = Number(article.dataset.index);
			const imageIndex = Number(input.dataset.image);
			const field = input.dataset.imageField as keyof ImageMeta;
			const image = albums[albumIndex].images[imageIndex];
			if (!image) return;
			(image.meta as Record<string, string | number | undefined>)[field] = input.value;
			syncAlbumImages(albums[albumIndex]);
		});
	});
}

async function scan() {
	const root = (document.getElementById("root") as HTMLInputElement | null)?.value ?? "";
	render("Scanning…");
	(document.getElementById("root") as HTMLInputElement).value = root;

	try {
		const response = await fetch("/api/scan", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ root }),
		});
		const data = (await response.json()) as ScanResponse;
		if (!response.ok) throw new Error(data.error || "Scan failed.");

		albums = data.albums;
		suggestions = data.suggestions;
		openAlbum = new Set();
		render(`Loaded ${albums.length} album${albums.length === 1 ? "" : "s"} from ${data.root}`, "ok");
		(document.getElementById("root") as HTMLInputElement).value = data.root;
	} catch (err) {
		const message = err instanceof Error ? err.message : "Scan failed.";
		render(message, "error");
		(document.getElementById("root") as HTMLInputElement).value = root;
	}
}

async function saveOne(index: number) {
	const album = albums[index];
	if (!album) return;
	syncAlbumImages(album);

	try {
		const response = await fetch("/api/metadata", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				folderPath: album.folderPath,
				metadata: album.metadata,
			}),
		});
		const data = (await response.json()) as { error?: string; path?: string };
		if (!response.ok) throw new Error(data.error || "Save failed.");

		album.hasMetadata = true;
		const root = (document.getElementById("root") as HTMLInputElement).value;
		render(`Wrote ${data.path}`, "ok");
		(document.getElementById("root") as HTMLInputElement).value = root;
	} catch (err) {
		const message = err instanceof Error ? err.message : "Save failed.";
		const root = (document.getElementById("root") as HTMLInputElement)?.value ?? "";
		render(message, "error");
		if (document.getElementById("root")) {
			(document.getElementById("root") as HTMLInputElement).value = root;
		}
	}
}

async function saveAll() {
	const root = (document.getElementById("root") as HTMLInputElement).value;
	albums.forEach(syncAlbumImages);

	try {
		const response = await fetch("/api/metadata/bulk", {
			method: "PUT",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				items: albums.map((album) => ({
					folderPath: album.folderPath,
					metadata: album.metadata,
				})),
			}),
		});
		const data = (await response.json()) as { error?: string; count?: number };
		if (!response.ok) throw new Error(data.error || "Bulk save failed.");

		albums = albums.map((album) => ({ ...album, hasMetadata: true }));
		render(`Wrote metadata.json for ${data.count} album${data.count === 1 ? "" : "s"}`, "ok");
		(document.getElementById("root") as HTMLInputElement).value = root;
	} catch (err) {
		const message = err instanceof Error ? err.message : "Bulk save failed.";
		render(message, "error");
		(document.getElementById("root") as HTMLInputElement).value = root;
	}
}

render();
