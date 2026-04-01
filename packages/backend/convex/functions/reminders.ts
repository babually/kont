import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";

export const getAllReminders = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			return [];
		}
		const userId = authUser._id;

		const reminders = await ctx.db
			.query("reminders")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.order("desc")
			.collect();

		// Get contact and meeting info for each reminder
		const remindersWithRelations = await Promise.all(
			reminders.map(async (reminder) => {
				let contact = null;
				let meeting = null;

				if (reminder.contactId) {
					contact = await ctx.db.get(reminder.contactId);
				}

				if (reminder.meetingId) {
					meeting = await ctx.db.get(reminder.meetingId);
				}

				return { ...reminder, contact, meeting };
			})
		);

		return remindersWithRelations;
	},
});

export const getReminderById = query({
	args: { id: v.id("reminders") },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		const reminder = await ctx.db.get(args.id);
		if (!reminder || reminder.userId !== authUser._id) {
			return null;
		}

		let contact = null;
		let meeting = null;

		if (reminder.contactId) {
			contact = await ctx.db.get(reminder.contactId);
		}

		if (reminder.meetingId) {
			meeting = await ctx.db.get(reminder.meetingId);
		}

		return { ...reminder, contact, meeting };
	},
});

export const createReminder = mutation({
	args: {
		contactId: v.optional(v.id("contacts")),
		meetingId: v.optional(v.id("meetings")),
		title: v.string(),
		description: v.optional(v.string()),
		dueDate: v.number(),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
		completed: v.boolean(),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		return await ctx.db.insert("reminders", {
			userId: authUser._id,
			...args,
		});
	},
});

export const updateReminder = mutation({
	args: {
		id: v.id("reminders"),
		contactId: v.optional(v.id("contacts")),
		meetingId: v.optional(v.id("meetings")),
		title: v.string(),
		description: v.optional(v.string()),
		dueDate: v.number(),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
		completed: v.boolean(),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		const { id, ...updates } = args;
		const reminder = await ctx.db.get(id);

		if (!reminder || reminder.userId !== authUser._id) {
			throw new Error("Reminder not found or unauthorized");
		}

		await ctx.db.patch(id, updates);
	},
});

export const deleteReminder = mutation({
	args: { id: v.id("reminders") },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		const reminder = await ctx.db.get(args.id);
		if (!reminder || reminder.userId !== authUser._id) {
			throw new Error("Reminder not found or unauthorized");
		}

		await ctx.db.delete(args.id);
	},
});

export const toggleComplete = mutation({
	args: { id: v.id("reminders") },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		const reminder = await ctx.db.get(args.id);
		if (!reminder || reminder.userId !== authUser._id) {
			throw new Error("Reminder not found or unauthorized");
		}

		await ctx.db.patch(args.id, { completed: !reminder.completed });
	},
});
