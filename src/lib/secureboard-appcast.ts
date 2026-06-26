import appcastXml from "virtual:secureboard-appcast";

export type SecureBoardRelease = {
	appName: string;
	version: string;
	build: string;
	minimumMacOS: string;
	downloadUrl: string;
	downloadFileName: string;
	fileSizeBytes: number;
	publishedAt: Date;
	publishedLabel: string;
};

const getTagValue = (block: string, tag: string) =>
	block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1]?.trim();

const getEnclosureAttributes = (block: string) => {
	const enclosure = block.match(/<enclosure\b([^>]*)\/?>/)?.[1];

	if (!enclosure) return null;

	const readAttribute = (name: string) => enclosure.match(new RegExp(`${name}="([^"]*)"`))?.[1];

	return {
		url: readAttribute("url"),
		length: readAttribute("length"),
	};
};

const parseAppcastItem = (block: string) => {
	const enclosure = getEnclosureAttributes(block);
	const publishedAt = new Date(getTagValue(block, "pubDate") ?? "");

	if (!enclosure?.url || !enclosure.length || Number.isNaN(publishedAt.getTime())) {
		return null;
	}

	const downloadUrl = new URL(enclosure.url);

	return {
		version: getTagValue(block, "sparkle:shortVersionString") ?? getTagValue(block, "title") ?? "",
		build: getTagValue(block, "sparkle:version") ?? "",
		minimumMacOS: getTagValue(block, "sparkle:minimumSystemVersion") ?? "",
		downloadUrl: downloadUrl.pathname,
		downloadFileName: downloadUrl.pathname.split("/").pop() ?? "",
		fileSizeBytes: Number(enclosure.length),
		publishedAt,
	};
};

export const formatFileSize = (bytes: number) => {
	const units = ["B", "KB", "MB", "GB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex += 1;
	}

	return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
};

export const getSecureBoardRelease = (): SecureBoardRelease => {
	const itemBlocks = [...appcastXml.matchAll(/<item>([\s\S]*?)<\/item>/g)]
		.map((match) => match[1])
		.map((block) => parseAppcastItem(block))
		.filter((item): item is NonNullable<typeof item> => item !== null)
		.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());

	const latest = itemBlocks[0];
	const appName = getTagValue(appcastXml, "title") ?? "SecureBoard";

	if (!latest?.version || !latest.build || !latest.minimumMacOS || !Number.isFinite(latest.fileSizeBytes)) {
		throw new Error("Unable to parse SecureBoard release metadata from appcast.xml");
	}

	return {
		appName,
		publishedLabel: latest.publishedAt.toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
		}),
		...latest,
	};
};
