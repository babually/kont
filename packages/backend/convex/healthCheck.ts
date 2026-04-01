// biome-ignore lint/style/useFilenamingConvention: Convex uses the filename for API pathing.
import { query } from "./_generated/server";

export const get = query({
	handler: () => {
		return "OK";
	},
});
