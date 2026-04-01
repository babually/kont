import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { authComponent } from "../auth";

export const getAllMeetings = query({
	args: {},
	handler: async (ctx) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			return [];
		}
		const userId = authUser._id;

		const meetings = await ctx.db
			.query("meetings")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.order("desc")
			.collect();

		// Get contact info for each meeting
		const meetingsWithContacts = await Promise.all(
			meetings.map(async (meeting) => {
				let contact = null;
				if (meeting.contactId) {
					contact = await ctx.db.get(meeting.contactId);
				}
				return { ...meeting, contact };
			})
		);

		return meetingsWithContacts;
	},
});

export const getMeetingById = query({
	args: { id: v.id("meetings") },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		const meeting = await ctx.db.get(args.id);
		if (!meeting || meeting.userId !== authUser._id) {
			return null;
		}

		let contact = null;
		if (meeting.contactId) {
			contact = await ctx.db.get(meeting.contactId);
		}

		return { ...meeting, contact };
	},
});

export const createMeeting = mutation({
	args: {
		contactId: v.optional(v.id("contacts")),
		title: v.string(),
		description: v.optional(v.string()),
		startTime: v.number(),
		endTime: v.number(),
		location: v.optional(v.string()),
		status: v.union(
			v.literal("scheduled"),
			v.literal("completed"),
			v.literal("cancelled")
		),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		return await ctx.db.insert("meetings", {
			userId: authUser._id,
			...args,
		});
	},
});

export const updateMeeting = mutation({
	args: {
		id: v.id("meetings"),
		contactId: v.optional(v.id("contacts")),
		title: v.string(),
		description: v.optional(v.string()),
		startTime: v.number(),
		endTime: v.number(),
		location: v.optional(v.string()),
		status: v.union(
			v.literal("scheduled"),
			v.literal("completed"),
			v.literal("cancelled")
		),
	},
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		const { id, ...updates } = args;
		const meeting = await ctx.db.get(id);

		if (!meeting || meeting.userId !== authUser._id) {
			throw new Error("Meeting not found or unauthorized");
		}

		await ctx.db.patch(id, updates);
	},
});

export const deleteMeeting = mutation({
	args: { id: v.id("meetings") },
	handler: async (ctx, args) => {
		const authUser = await authComponent.safeGetAuthUser(ctx);
		if (!authUser) {
			throw new Error("Not authenticated");
		}

		const meeting = await ctx.db.get(args.id);
		if (!meeting || meeting.userId !== authUser._id) {
			throw new Error("Meeting not found or unauthorized");
		}

		await ctx.db.delete(args.id);
	},
});
