import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Badge } from "@kont/ui/components/badge";
import { Button } from "@kont/ui/components/button";
import { Dialog, DialogContent } from "@kont/ui/components/dialog";
import { cn } from "@kont/ui/lib/utils";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Filter, Plus, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { ContactCard } from "./-components/contact-card";
import { ContactForm } from "./-components/contact-form";

export const Route = createFileRoute("/dashboard/contacts/")({
	component: RouteComponent,
});

function RouteComponent() {
	// Tag filter state - null means "All" (no filter applied)
	const [selectedTag, setSelectedTag] = useState<string | null>(null);

	const contactsQuery = useSuspenseQuery(
		convexQuery(api.functions.contacts.getAllContacts, {})
	);
	const contacts = contactsQuery.data;

	const toggleFavorite = useMutation(api.functions.contacts.toggleFavorite);
	const deleteContact = useMutation(api.functions.contacts.deleteContact);

	// Calculate tag counts from contacts
	const tagCounts =
		contacts?.reduce(
			(acc, contact) => {
				if (contact.tags) {
					for (const tag of contact.tags) {
						const trimmed = tag.trim();
						if (trimmed) {
							acc[trimmed] = (acc[trimmed] || 0) + 1;
						}
					}
				}
				return acc;
			},
			{} as Record<string, number>
		) || {};

	// Extract unique tags from the count object
	const tags: string[] = Object.keys(tagCounts).sort();

	const handleToggleFavorite = async (id: Id<"contacts">) => {
		try {
			await toggleFavorite({ id });
		} catch (error) {
			console.error("Failed to toggle favorite:", error);
		}
	};

	// Filter contacts by selected tag
	// If no tag is selected (null), show all contacts
	const filteredContacts = selectedTag
		? contacts?.filter((contact) => contact.tags?.includes(selectedTag))
		: contacts;

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingContactId, setEditingContactId] =
		useState<Id<"contacts"> | null>(null);

	const handleDeleteContact = async (id: Id<"contacts">) => {
		try {
			await deleteContact({ id });
		} catch (error) {
			console.error("Failed to delete contact:", error);
		}
	};

	const handleEditContact = (id: Id<"contacts">) => {
		setEditingContactId(id);
		setIsDialogOpen(true);
	};

	const handleAddContact = () => {
		setEditingContactId(null);
		setIsDialogOpen(true);
	};

	const isLoading = contacts === undefined;
	const isEmpty = contacts !== undefined && contacts.length === 0;

	// Handle tag selection with proper typing
	const handleTagSelect = (tag: string | null) => {
		setSelectedTag(tag);
	};

	// Handle keyboard interaction for accessibility
	const handleTagKeyDown = (
		e: React.KeyboardEvent<HTMLSpanElement>,
		tag: string | null
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			setSelectedTag(tag);
		}
	};

	// Handle clear filter X button click
	const handleClearFilter = (
		e: React.MouseEvent<SVGElement>,
		tag: string | null
	) => {
		e.stopPropagation();
		setSelectedTag(tag);
	};

	// Handle clear filter X button keyboard interaction
	const handleClearFilterKeyDown = (
		e: React.KeyboardEvent<SVGElement>,
		tag: string | null
	) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			e.stopPropagation();
			setSelectedTag(tag);
		}
	};

	return (
		<div className="flex min-h-svh flex-col gap-6 bg-muted p-6 md:p-10">
			<div className="mx-auto w-full max-w-4xl space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h1 className="font-bold text-2xl text-primary">Contacts</h1>
						<p className="text-muted-foreground text-sm">
							{filteredContacts?.length ?? 0}{" "}
							{filteredContacts?.length === 1 ? "person" : "people"} in your
							network
							{selectedTag && (
								<span className="text-xs"> (filtered by: {selectedTag})</span>
							)}
						</p>
					</div>
					<div className="flex gap-2">
						<Button className="gap-2" variant="outline">
							<SlidersHorizontal className="h-4 w-4" />
							Select
						</Button>
						<Dialog
							onOpenChange={(open) => {
								setIsDialogOpen(open);
								if (!open) {
									setEditingContactId(null);
								}
							}}
							open={isDialogOpen}
						>
							<Button onClick={handleAddContact}>
								<Plus className="mr-2 h-4 w-4" />
								Add Contact
							</Button>
							<DialogContent>
								<ContactForm
									contactId={editingContactId}
									onClose={() => setIsDialogOpen(false)}
								/>
							</DialogContent>
						</Dialog>
					</div>
				</div>

				{isLoading && (
					<div className="flex items-center justify-center py-10">
						<p className="text-muted-foreground">Loading contacts...</p>
					</div>
				)}

				{isEmpty && (
					<div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-background py-10">
						<p className="text-muted-foreground">No contacts yet</p>
						<p className="text-muted-foreground text-sm">
							Create your first contact to get started
						</p>
					</div>
				)}

				{/* Tags filters - only show when there are tags available */}
				{tags.length > 0 && (
					<div className="flex flex-wrap items-center gap-2">
						<Filter
							aria-hidden="true"
							className="h-4 w-4 text-muted-foreground"
						/>
						{/* "All" option to clear filter */}
						<Badge
							aria-pressed={selectedTag === null}
							className={cn(
								"flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-1 transition-colors",
								selectedTag === null
									? "bg-foreground text-background hover:bg-foreground/90"
									: "bg-card text-foreground hover:bg-muted"
							)}
							key="all"
							onClick={() => handleTagSelect(null)}
							onKeyDown={(e) => handleTagKeyDown(e, null)}
							role="button"
							tabIndex={0}
							variant={selectedTag === null ? "default" : "outline"}
						>
							All
						</Badge>
						{/* Individual tag filters */}
						{tags.map((tag) => (
							<Badge
								aria-pressed={selectedTag === tag}
								className={cn(
									"flex h-10 cursor-pointer items-center gap-2 rounded-lg px-3 py-1 transition-colors",
									selectedTag === tag
										? "bg-foreground text-background hover:bg-foreground/90"
										: "bg-card text-foreground hover:bg-muted"
								)}
								key={tag}
								onClick={() => handleTagSelect(tag)}
								onKeyDown={(e) => handleTagKeyDown(e, tag)}
								role="button"
								tabIndex={0}
								variant={selectedTag === tag ? "default" : "outline"}
							>
								<span>{tag}</span>
								{tagCounts[tag] > 1 && (
									<span
										className={cn(
											"flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 font-bold text-[10px]",
											selectedTag === tag
												? "bg-background text-foreground"
												: "bg-muted text-muted-foreground"
										)}
									>
										({tagCounts[tag]})
									</span>
								)}
								{selectedTag === tag && (
									<X
										aria-label={`Clear ${tag} filter`}
										className="h-3 w-3 opacity-70 transition-opacity hover:opacity-100"
										onClick={(e) => handleClearFilter(e, null)}
										onKeyDown={(e) => handleClearFilterKeyDown(e, null)}
									/>
								)}
							</Badge>
						))}
					</div>
				)}

				{contacts && filteredContacts && filteredContacts.length > 0 && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{filteredContacts.map((contact) => (
							<ContactCard
								contact={contact}
								key={contact._id}
								onDelete={handleDeleteContact}
								onEdit={handleEditContact}
								onToggleFavorite={handleToggleFavorite}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
