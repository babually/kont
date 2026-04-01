import { useUploadFile } from "@convex-dev/r2/react";
import { api } from "@kont/backend/convex/_generated/api";
import { useAction } from "convex/react";
import { useCallback, useState } from "react";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = [
	"image/jpeg",
	"image/png",
	"image/gif",
	"image/webp",
	"image/svg+xml",
];

export interface UploadResult {
	key: string;
	url: string;
}

export function validateImageFile(
	file: File
): { valid: true } | { valid: false; error: string } {
	if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
		return {
			valid: false,
			error: "Please select a valid image file (JPEG, PNG, GIF, WebP, SVG)",
		};
	}

	if (file.size > MAX_FILE_SIZE) {
		return {
			valid: false,
			error: "Image must be less than 10MB",
		};
	}

	return { valid: true };
}

export function useImageUpload() {
	const uploadFile = useUploadFile(api.r2);
	const getFileUrl = useAction(api.r2.getFileUrl);
	const [isUploading, setIsUploading] = useState(false);

	const upload = useCallback(
		async (file: File): Promise<UploadResult | null> => {
			const validation = validateImageFile(file);
			if (!validation.valid) {
				throw new Error(validation.error);
			}

			setIsUploading(true);
			try {
				const key = await uploadFile(file);
				const url = await getFileUrl({ key });
				return { key, url };
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Upload failed";
				if (message.includes("Failed to upload file")) {
					throw new Error(
						"Upload to storage failed. Check R2 CORS configuration to allow PUT requests from this origin."
					);
				}
				if (message.includes("Not authenticated")) {
					throw new Error("You must be signed in to upload files.");
				}
				throw new Error(message);
			} finally {
				setIsUploading(false);
			}
		},
		[uploadFile, getFileUrl]
	);

	return { upload, isUploading };
}

export function createObjectURL(file: File): string {
	return URL.createObjectURL(file);
}

export function revokeObjectURL(url: string): void {
	URL.revokeObjectURL(url);
}
