import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projectPages = defineCollection({
	loader: glob({
		base: "./src/content/project-pages",
		pattern: "**/*.md",
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		linkLabel: z.string().optional(),
	}),
});

const blogPosts = defineCollection({
	loader: glob({
		base: "./src/content/blog",
		pattern: "*.md",
	}),
	schema: z.object({
		title: z.string(),
		description: z.string(),
		date: z.date(),
	}),
});

export const collections = { projectPages, blogPosts };
