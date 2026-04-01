import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Button } from "@kont/ui/components/button";
import {
	Card,
	CardAction,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@kont/ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@kont/ui/components/dropdown-menu";
import { useMutation } from "convex/react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

interface MeetingCardProps {
	meeting: {
		_id: Id<"meetings">;
		title: string;
		description?: string;
		startTime: number;
		endTime: number;
		location?: string;
		status: "scheduled" | "completed" | "cancelled";
		contact?: {
			_id: Id<"contacts">;
			fullName: string;
		} | null;
	};
	onDelete: (id: Id<"meetings">) => void;
	onEdit: (id: Id<"meetings">) => void;
}

export function MeetingCard({ meeting, onDelete, onEdit }: MeetingCardProps) {
	const deleteMeeting = useMutation(api.functions.meetings.deleteMeeting);

	const handleDelete = async (id: Id<"meetings">) => {
		// biome-ignore lint/suspicious/noAlert: Using native confirm for simplicity
		if (confirm("Are you sure you want to delete this meeting?")) {
			await deleteMeeting({ id });
			onDelete(id);
		}
	};

	const formatDateTime = (timestamp: number) => {
		const date = new Date(timestamp);
		return date.toLocaleString();
	};

	const getStatusColor = (status: string) => {
		switch (status) {
			case "scheduled":
				return "bg-blue-100 text-blue-800";
			case "completed":
				return "bg-green-100 text-green-800";
			case "cancelled":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	// const isPast = (timestamp: number): boolean => {
	// 	return new Date(timestamp) < new Date();
	// };

	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<h3 className="font-semibold text-gray-900 text-lg">
						{meeting.title}
					</h3>
				</CardTitle>
				<CardDescription>
					<span
						className={`space-y-3 rounded-full px-2 py-1 font-medium text-xs ${getStatusColor(meeting.status)}`}
					>
						{meeting.status}
					</span>
				</CardDescription>
				<CardAction className="-me-1">
					{/* <div className=""> */}
					<DropdownMenu>
						<DropdownMenuTrigger>
							<Button className="h-8 w-8" size="icon" variant="ghost">
								<MoreVertical className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="w-32">
							<DropdownMenuItem onClick={() => onEdit(meeting._id)}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuItem
								className="text-destructive focus:text-destructive"
								onClick={() => handleDelete(meeting._id)}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					{/* </div> */}
				</CardAction>
			</CardHeader>
			<CardContent>
				<div className="">
					<div className="mb-3 space-y-2 text-gray-600 text-sm">
						<div className="flex items-center gap-2">
							<span className="font-medium">Start:</span>
							<span>{formatDateTime(meeting.startTime)}</span>
						</div>
						<div className="flex items-center gap-2">
							<span className="font-medium">End:</span>
							<span>{formatDateTime(meeting.endTime)}</span>
						</div>
						{meeting.location && (
							<div className="flex items-center gap-2">
								<span className="font-medium">Location:</span>
								<span>{meeting.location}</span>
							</div>
						)}
						{meeting.contact && (
							<div className="flex items-center gap-2">
								<span className="font-medium">Contact:</span>
								<span>{meeting.contact.fullName}</span>
							</div>
						)}
					</div>

					{meeting.description && (
						<p className="mb-4 text-gray-600 text-sm">{meeting.description}</p>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
