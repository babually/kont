import { createMiddleware } from "@tanstack/react-start";

import { authClient } from "@/lib/auth-client";

export const authMiddleware = createMiddleware().server(
	async ({ next, request }) => {
		try {
			const origin = request.headers.get("origin");
			const requestUrlOrigin = new URL(request.url).origin;
			const baseURL = origin || requestUrlOrigin;

			const resp = await authClient.getSession({
				fetchOptions: {
					headers: request.headers,
					baseURL,
				},
			});

			// Normalize to a plain-serializable value. `resp` may contain helper
			// fields or Error objects that can break seroval deserialization on the
			// client, so only pass the plain `data` (or null) into context.
			const session = resp?.data ?? null;

			return next({
				context: { session },
			});
		} catch (err) {
			console.error("authMiddleware getSession error:", err);
			return next({ context: { session: null } });
		}
	}
);
