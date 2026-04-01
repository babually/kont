import { Button } from "@kont/ui/components/button";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@kont/ui/components/empty";
import { ArrowUpRightIcon } from "lucide-react";

interface EmptyReminderProps {
	onAddReminder: () => void;
}

export function EmptyReminder({ onAddReminder }: EmptyReminderProps) {
	return (
		<Empty>
			<EmptyHeader>
				<EmptyMedia variant="icon">
					<div className="mb-4 text-6xl text-gray-400">⏰</div>
				</EmptyMedia>
				<EmptyTitle>No Reminders Yet</EmptyTitle>
				<EmptyDescription>
					Create your first reminder to stay organized.
				</EmptyDescription>
			</EmptyHeader>
			<EmptyContent>
				<Button
					className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
					onClick={() => onAddReminder()}
					// onClick={() => setShowForm(true)}
				>
					Add Reminder
				</Button>
			</EmptyContent>
			<Button className="text-muted-foreground" size="sm" variant="link">
				<a href="#">
					Learn More <ArrowUpRightIcon />
				</a>
			</Button>
		</Empty>
	);
}
