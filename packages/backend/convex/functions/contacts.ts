import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";

export const getAllContacts = query({
	handler: async (ctx) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			return [];
		}
		const contacts = await ctx.db
			.query("contacts")
			.withIndex("by_user", (q) => q.eq("userId", authUser._id))
			.collect();
		return contacts;
	},
});

export const getFavoriteContacts = query({
	handler: async (ctx) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			return [];
		}
		const contacts = await ctx.db
			.query("contacts")
			.withIndex("by_user_and_favorite", (q) =>
				q.eq("userId", authUser._id).eq("isFavorite", true)
			)
			.collect();
		return contacts;
	},
});

export const getContactById = query({
	args: {
		id: v.id("contacts"),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}
		const contact = await ctx.db.get("contacts", args.id);
		return contact;
	},
});

export const createContact = mutation({
	args: {
		fullName: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		jobTitle: v.string(),
		company: v.optional(v.string()),
		position: v.optional(v.string()),
		image: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}

		const contactId = await ctx.db.insert("contacts", {
			userId: authUser._id,
			isFavorite: false,
			...args,
		});
		return await ctx.db.get("contacts", contactId);
	},
});

export const updateContact = mutation({
	args: {
		id: v.id("contacts"),
		fullName: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		jobTitle: v.string(),
		company: v.optional(v.string()),
		position: v.optional(v.string()),
		image: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}
		const contact = await ctx.db.get("contacts", args.id);
		if (!contact || contact.userId !== authUser._id) {
			throw new Error("Contact not found or unauthorized");
		}
		await ctx.db.patch("contacts", args.id, {
			fullName: args.fullName,
			email: args.email,
			phone: args.phone,
			jobTitle: args.jobTitle,
			company: args.company,
			position: args.position,
			image: args.image,
			tags: args.tags,
		});
		return await ctx.db.get("contacts", args.id);
	},
});

export const deleteContact = mutation({
	args: {
		id: v.id("contacts"),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}
		const contact = await ctx.db.get("contacts", args.id);
		if (!contact || contact.userId !== authUser._id) {
			throw new Error("Contact not found or unauthorized");
		}
		await ctx.db.delete("contacts", args.id);
		return { success: true };
	},
});

export const toggleFavorite = mutation({
	args: {
		id: v.id("contacts"),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Unauthorized");
		}
		const contact = await ctx.db.get("contacts", args.id);
		if (!contact || contact.userId !== authUser._id) {
			throw new Error("Contact not found or unauthorized");
		}
		await ctx.db.patch("contacts", args.id, {
			isFavorite: !contact.isFavorite,
		});
		return await ctx.db.get("contacts", args.id);
	},
});
