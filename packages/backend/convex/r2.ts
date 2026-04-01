import { R2 } from "@convex-dev/r2";
import { v } from "convex/values";
import { components } from "./_generated/api";
import type { DataModel } from "./_generated/dataModel";
import { action, query } from "./_generated/server";

export const r2 = new R2(components.r2);

export const { generateUploadUrl, syncMetadata, deleteObject } =
	r2.clientApi<DataModel>({
		checkUpload: async (ctx) => {
			const identity = await ctx.auth.getUserIdentity();
			if (!identity) {
				throw new Error("Not authenticated");
			}
		},
		checkDelete: async (ctx) => {
			const identity = await ctx.auth.getUserIdentity();
			if (!identity) {
				throw new Error("Not authenticated");
			}
		},
		onUpload: (_ctx, _bucket, key) => {
			console.log(`File uploaded with key: ${key}`);
		},
	});

export const getFileUrl = action({
	args: {
		key: v.string(),
		expiresIn: v.optional(v.number()),
	},
	handler: async (_ctx, { key, expiresIn = 60 * 60 * 24 }) => {
		return await r2.getUrl(key, { expiresIn });
	},
});

export const getFileMetadata = query({
	args: {
		key: v.string(),
	},
	handler: async (ctx, args) => {
		return await r2.getMetadata(ctx, args.key);
	},
});
