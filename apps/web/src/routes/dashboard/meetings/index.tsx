import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Button } from "@kont/ui/components/button";
import {
	Dialog,
	DialogContent,
	DialogTrigger,
} from "@kont/ui/components/dialog";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Plus } from "lucide-react";
import { useState } from "react";
import { MeetingCard } from "./-components/meeting-card";
import { MeetingForm } from "./-components/meeting-form";

export const Route = createFileRoute("/dashboard/meetings/")({
	component: RouteComponent,
});

function RouteComponent() {
	const meetingsQuery = useSuspenseQuery(
		convexQuery(api.functions.meetings.getAllMeetings, {})
	);

	const meetings = meetingsQuery.data;

	const deleteMeeting = useMutation(api.functions.meetings.deleteMeeting);
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingMeetingId, setEditingMeetingId] =
		useState<Id<"meetings"> | null>(null);

	const handleDeleteMeeting = async (id: Id<"meetings">) => {
		// biome-ignore lint/suspicious/noAlert: Using native confirm for simplicity
		if (confirm("Are you sure you want to delete this meeting?")) {
			try {
				await deleteMeeting({ id });
			} catch (error) {
				console.error("Failed to delete meeting:", error);
			}
		}
	};

	const handleEditMeeting = (id: Id<"meetings">) => {
		setEditingMeetingId(id);
		setIsDialogOpen(true);
	};

	const handleCloseForm = () => {
		setIsDialogOpen(false);
		setEditingMeetingId(null);
	};

	const isLoading = meetings === undefined;
	const isEmpty = meetings !== undefined && meetings.length === 0;

	return (
		<div className="flex min-h-svh flex-col gap-6 bg-muted p-6 md:p-10">
			<div className="mx-auto w-full max-w-4xl space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl text-primary">Meetings</h2>
					<Dialog onOpenChange={setIsDialogOpen} open={isDialogOpen}>
						<DialogTrigger>
							<Button>
								<Plus className="mr-2 h-4 w-4" />
								Schedule Meeting
							</Button>
						</DialogTrigger>
						<DialogContent>
							<MeetingForm
								meetingId={editingMeetingId}
								onClose={handleCloseForm}
							/>
						</DialogContent>
					</Dialog>
				</div>

				{isLoading && (
					<div className="flex items-center justify-center py-10">
						<p className="text-muted-foreground">Loading meetings...</p>
					</div>
				)}

				{isEmpty && (
					<div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-background py-10">
						<p className="text-muted-foreground">No meetings yet</p>
						<p className="text-muted-foreground text-sm">
							Schedule your first meeting to get started
						</p>
					</div>
				)}

				{meetings && meetings.length > 0 && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{meetings.map((meeting) => (
							<MeetingCard
								key={meeting._id}
								meeting={{
									...meeting,
									contact: meeting.contact
										? {
												_id: meeting.contact._id,
												fullName: meeting.contact.fullName,
											}
										: null,
								}}
								onDelete={handleDeleteMeeting}
								onEdit={handleEditMeeting}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
