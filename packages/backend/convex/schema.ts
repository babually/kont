import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
	contacts: defineTable({
		userId: v.string(),
		fullName: v.string(),
		email: v.optional(v.string()),
		phone: v.optional(v.string()),
		jobTitle: v.string(),
		company: v.optional(v.string()),
		position: v.optional(v.string()),
		image: v.optional(v.string()),
		tags: v.optional(v.array(v.string())),
		isFavorite: v.optional(v.boolean()),
	})
		.index("by_user", ["userId"])
		.index("by_user_and_name", ["userId", "fullName"])
		.index("by_user_and_favorite", ["userId", "isFavorite"]),

	meetings: defineTable({
		userId: v.string(),
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
	})
		.index("by_user", ["userId"])
		.index("by_user_and_time", ["userId", "startTime"])
		.index("by_contact", ["contactId"]),

	reminders: defineTable({
		userId: v.string(),
		contactId: v.optional(v.id("contacts")),
		meetingId: v.optional(v.id("meetings")),
		title: v.string(),
		description: v.optional(v.string()),
		dueDate: v.number(),
		priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
		completed: v.boolean(),
	})
		.index("by_user", ["userId"])
		.index("by_user_and_due_date", ["userId", "dueDate"])
		.index("by_contact", ["contactId"])
		.index("by_meeting", ["meetingId"]),
	favourite: defineTable({
		userId: v.string(),
		contactId: v.id("contacts"),
	})
		.index("by_user", ["userId"])
		.index("by_user_and_contact", ["userId", "contactId"]),
	todos: defineTable({
		text: v.string(),
		completed: v.boolean(),
	}),
});
