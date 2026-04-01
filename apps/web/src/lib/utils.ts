import { r2 } from "@kont/backend/convex/r2";

export function generateSlug(text: string): string {
	return text
		.toLowerCase()
		.replace(/[a-z0-9]+/g, "-")
		.replace(/(^-|-$)/g, "");
}

export const resolveImage = async (
	key: string | undefined | null
): Promise<string | undefined> => {
	if (!key) {
		return undefined;
	}
	if (key.startsWith("http")) {
		return key;
	}
	return await r2.getUrl(key, { expiresIn: 60 * 60 * 24 });
};

export const resolveImages = async (
	key: string[] | undefined | null
): Promise<string[]> => {
	return Promise.all(
		(key ?? []).map((key) => resolveImage(key).then((url) => url ?? ""))
	);
};
