import type { Id } from "@kont/backend/convex/_generated/dataModel";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@kont/ui/components/avatar";
import { Badge } from "@kont/ui/components/badge";
import { Button } from "@kont/ui/components/button";
import { Card, CardContent, CardHeader } from "@kont/ui/components/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@kont/ui/components/dropdown-menu";
import {
	Item,
	ItemActions,
	ItemContent,
	ItemDescription,
	ItemMedia,
	ItemTitle,
} from "@kont/ui/components/item";
import { cn } from "@kont/ui/lib/utils";
import {
	Briefcase,
	Mail,
	MoreVertical,
	Pencil,
	Phone,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useResolveImage } from "@/lib/upload";

interface ContactCardProps {
	contact: {
		_id: Id<"contacts">;
		fullName: string;
		jobTitle: string;
		company?: string;
		email?: string;
		phone?: string;
		image?: string;
		tags?: string[];
		// isFavorite: boolean;
	};
	onDelete: (id: Id<"contacts">) => void;
	onEdit: (id: Id<"contacts">) => void;
	onToggleFavorite: (id: Id<"contacts">, isFavorite: boolean) => void;
}

export function ContactCard({ contact, onDelete, onEdit }: ContactCardProps) {
	const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
	const { resolve } = useResolveImage();

	useEffect(() => {
		if (contact.image) {
			resolve(contact.image).then(setImageUrl);
		} else {
			setImageUrl(undefined);
		}
	}, [contact.image, resolve]);

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<Card className="group relative overflow-hidden border-0 bg-card/50 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
			<CardHeader className="-mr-1 flex flex-row items-center justify-between py-2.5">
				<Item className="w-full gap-2.5 p-0">
					<ItemMedia>
						<Avatar className="h-11 w-11 shadow-md ring-2 ring-background">
							{imageUrl ? (
								<AvatarImage
									alt={contact.fullName}
									className="object-cover"
									src={imageUrl}
								/>
							) : (
								<AvatarFallback className="bg-linear-to-br from-primary to-primary/80 font-semibold text-primary-foreground text-sm">
									{getInitials(contact.fullName)}
								</AvatarFallback>
							)}
						</Avatar>
					</ItemMedia>
					<ItemContent className="gap-0">
						<ItemTitle>{contact.fullName}</ItemTitle>
						<ItemDescription className="flex flex-wrap gap-1 text-xs">
							{contact.tags?.map((tag) => (
								<Badge
									className={cn("px-2 py-2 font-medium text-[10px]")}
									key={tag}
									variant="secondary"
								>
									{tag}
								</Badge>
							))}
						</ItemDescription>
					</ItemContent>
					<ItemActions className="-me-1">
						<DropdownMenu>
							<DropdownMenuTrigger>
								<Button
									className="h-8 w-8 rounded-full text-muted-foreground/50 opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
									size="icon"
									variant="ghost"
								>
									<MoreVertical className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end" className="w-32">
								<DropdownMenuItem onClick={() => onEdit(contact._id)}>
									<Pencil className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									className="text-destructive focus:text-destructive"
									onClick={() => onDelete(contact._id)}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</ItemActions>
				</Item>
			</CardHeader>
			<CardContent className="p-5">
				{/* Contact Info */}
				<div className="space-y-2">
					{(contact.jobTitle || contact.company) && (
						<div className="flex items-center gap-2">
							<Briefcase className="h-3.5 w-3.5 shrink-0" />
							<span className="truncate">
								{contact.jobTitle}
								{contact.jobTitle && contact.company && " at "}
								{contact.company}
							</span>
						</div>
					)}
					{contact.email && (
						<a
							className="group/link flex items-center gap-2.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
							href={`mailto:${contact.email}`}
						>
							<div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/50 transition-colors group-hover/link:bg-muted">
								<Mail className="h-3.5 w-3.5" />
							</div>
							<span className="truncate">{contact.email}</span>
						</a>
					)}

					{contact.phone && (
						<a
							className="group/link flex items-center gap-2.5 text-muted-foreground text-sm transition-colors hover:text-foreground"
							href={`tel:${contact.phone}`}
						>
							<div className="flex h-7 w-7 items-center justify-center rounded-md bg-muted/50 transition-colors group-hover/link:bg-muted">
								<Phone className="h-3.5 w-3.5" />
							</div>
							<span>{contact.phone}</span>
						</a>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
