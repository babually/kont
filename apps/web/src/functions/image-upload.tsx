import { Button } from "@kont/ui/components/button";
import { Input } from "@kont/ui/components/input";
import { cn } from "@kont/ui/lib/utils";
import { ImageIcon, X } from "lucide-react";
import {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from "react";
import { toast } from "sonner";
import {
	createObjectURL,
	revokeObjectURL,
	useImageUpload,
	useResolveImage,
	validateImageFile,
} from "@/lib/upload";

interface ImageUploadProps {
	className?: string;
	disabled?: boolean;
	hideDefaultUI?: boolean;
	onRemove: () => void;
	onUploadComplete: (key: string) => void;
	value?: string;
}

export interface ImageUploadHandle {
	triggerUpload: () => void;
}

export const ImageUpload = forwardRef<ImageUploadHandle, ImageUploadProps>(
	(
		{
			value,
			onUploadComplete,
			onRemove,
			className,
			disabled = false,
			hideDefaultUI = false,
		},
		ref
	) => {
		const inputRef = useRef<HTMLInputElement>(null);
		const [preview, setPreview] = useState<string | undefined>(undefined);
		const [resolvedUrl, setResolvedUrl] = useState<string | undefined>(
			undefined
		);
		const [isDragging, setIsDragging] = useState(false);
		const { upload, isUploading } = useImageUpload();
		const { resolve } = useResolveImage();

		useImperativeHandle(ref, () => ({
			triggerUpload: () => {
				if (inputRef.current) {
					inputRef.current.click();
				}
			},
		}));

		const revokePreview = useCallback(() => {
			if (preview) {
				revokeObjectURL(preview);
				setPreview(undefined);
			}
		}, [preview]);

		useEffect(() => {
			if (value) {
				resolve(value).then(setResolvedUrl);
			} else {
				setResolvedUrl(undefined);
			}
		}, [value, resolve]);

		useEffect(() => {
			return () => {
				if (preview) {
					revokeObjectURL(preview);
				}
			};
		}, [preview]);

		const handleFile = useCallback(
			async (file: File) => {
				const validation = validateImageFile(file);
				if (!validation.valid) {
					toast.error(validation.error);
					return;
				}

				revokePreview();
				const url = createObjectURL(file);
				setPreview(url);

				try {
					const result = await upload(file);
					if (result) {
						onUploadComplete(result.key);
					}
				} catch (error) {
					revokeObjectURL(url);
					setPreview(undefined);
					toast.error(error instanceof Error ? error.message : "Upload failed");
				}
			},
			[upload, onUploadComplete, revokePreview]
		);

		const handleRemove = useCallback(() => {
			revokePreview();
			onRemove();
			if (inputRef.current) {
				inputRef.current.value = "";
			}
		}, [revokePreview, onRemove]);

		const handleDrop = useCallback(
			(e: React.DragEvent) => {
				e.preventDefault();
				setIsDragging(false);
				if (disabled || isUploading) {
					return;
				}

				const file = e.dataTransfer.files.item(0);
				if (file) {
					handleFile(file);
				}
			},
			[disabled, isUploading, handleFile]
		);

		const handleDragOver = useCallback(
			(e: React.DragEvent) => {
				e.preventDefault();
				if (!(disabled || isUploading)) {
					setIsDragging(true);
				}
			},
			[disabled, isUploading]
		);

		const handleDragLeave = useCallback((e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);
		}, []);

		const displayUrl = preview ?? resolvedUrl ?? value;
		const isBusy = isUploading || disabled;

		return (
			<div className={cn("relative", className)}>
				<Input
					accept="image/*"
					className="hidden"
					disabled={isBusy}
					onChange={(e) => {
						const file = e.target.files?.item(0);
						if (file) {
							handleFile(file);
						}
						e.target.value = "";
					}}
					ref={inputRef}
					type="file"
				/>

				{displayUrl ? (
					<div className="group relative h-full w-full">
						<img
							alt="Contact avatar"
							className="h-full w-full rounded-md object-cover"
							height={200}
							src={displayUrl}
							width={200}
						/>
						{isBusy ? null : (
							<Button
								className="absolute top-1 right-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
								onClick={handleRemove}
								size="icon"
								type="button"
								variant="destructive"
							>
								<X className="h-4 w-4" />
							</Button>
						)}
						{isUploading ? (
							<div className="absolute inset-0 flex items-center justify-center rounded-md bg-black/50">
								<div className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
							</div>
						) : null}
					</div>
				) : (
					!hideDefaultUI && (
						<button
							className={cn(
								"flex h-full w-full flex-col items-center justify-center rounded-md border-2 border-muted-foreground/25 border-dashed transition-colors",
								isDragging && "border-primary bg-primary/5",
								!isBusy &&
									"cursor-pointer hover:border-primary hover:bg-primary/5",
								isBusy && "cursor-not-allowed opacity-50"
							)}
							disabled={isBusy}
							onClick={() => inputRef.current?.click()}
							onDragLeave={handleDragLeave}
							onDragOver={handleDragOver}
							onDrop={handleDrop}
							type="button"
						>
							{isUploading ? (
								<div className="h-6 w-6 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
							) : (
								<div className="rounded-full bg-muted p-2">
									<ImageIcon className="h-5 w-5 text-muted-foreground" />
								</div>
							)}
						</button>
					)
				)}
			</div>
		);
	}
);

ImageUpload.displayName = "ImageUpload";
