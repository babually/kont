import { convexQuery } from "@convex-dev/react-query";
import { api } from "@kont/backend/convex/_generated/api";
import type { Id } from "@kont/backend/convex/_generated/dataModel";
import { Button } from "@kont/ui/components/button";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "convex/react";
import { Heart } from "lucide-react";
import { ContactCard } from "../contacts/-components/contact-card";

export const Route = createFileRoute("/dashboard/favorites/")({
	component: RouteComponent,
});

function RouteComponent() {
	const favoritesQuery = useSuspenseQuery(
		convexQuery(api.functions.contacts.getFavoriteContacts, {})
	);
	const favorites = favoritesQuery.data;

	const toggleFavorite = useMutation(api.functions.contacts.toggleFavorite);
	const deleteContact = useMutation(api.functions.contacts.deleteContact);

	const handleToggleFavorite = async (id: Id<"contacts">) => {
		try {
			await toggleFavorite({ id });
		} catch (error) {
			console.error("Failed to toggle favorite:", error);
		}
	};

	const handleDeleteContact = async (id: Id<"contacts">) => {
		try {
			await deleteContact({ id });
		} catch (error) {
			console.error("Failed to delete contact:", error);
		}
	};

	const handleEditContact = (_id: Id<"contacts">) => {
		// TODO: Implement edit functionality
		console.log("Edit contact:", _id);
	};

	const isLoading = favorites === undefined;
	const isEmpty = favorites !== undefined && favorites.length === 0;

	return (
		<div className="flex min-h-svh flex-col gap-6 bg-muted p-6 md:p-10">
			<div className="mx-auto w-full max-w-4xl space-y-6">
				<div className="flex items-center justify-between">
					<h2 className="font-bold text-2xl text-primary">Favorite Contacts</h2>
					<Button variant="link">
						<a href="/dashboard/contacts">View All Contacts</a>
					</Button>
				</div>

				{isLoading && (
					<div className="flex items-center justify-center py-10">
						<p className="text-muted-foreground">Loading favorites...</p>
					</div>
				)}

				{isEmpty && (
					<div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-background py-10">
						<Heart className="h-12 w-12 text-muted-foreground" />
						<p className="text-muted-foreground">No favorite contacts yet</p>
						<p className="text-muted-foreground text-sm">
							Click the heart icon on a contact to add them to favorites
						</p>
					</div>
				)}

				{favorites && favorites.length > 0 && (
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{favorites.map((contact) => (
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
