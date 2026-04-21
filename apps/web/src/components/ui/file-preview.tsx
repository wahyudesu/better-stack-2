"use client";

import type { FC } from "react";
import { cn } from "@/lib/utils";
import { Cancel01Icon, HugeiconsIcon } from "@/lib/utils/tool-icons";

export interface UploadedFile {
	id: string;
	name: string;
	url?: string;
	type?: string;
	size?: number;
	file?: File;
	/** Preview URL for image files created with URL.createObjectURL */
	preview?: string;
}

export interface FilePreviewProps {
	files: UploadedFile[];
	onRemove?: (id: string) => void;
	className?: string;
}

export const FilePreview: FC<FilePreviewProps> = ({
	files,
	onRemove,
	className,
}) => {
	if (files.length === 0) return null;

	return (
		<div className={cn("px-3 pb-2", className)}>
			{files.map((file) => (
				<div
					key={file.id}
					className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
				>
					{file.preview ? (
						<div className="flex-shrink-0 w-10 h-10 rounded overflow-hidden">
							<img
								src={file.preview}
								alt=""
								className="w-full h-full object-cover"
							/>
						</div>
					) : (
						<div className="flex-shrink-0 w-10 h-10 rounded bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
							📄
						</div>
					)}
					<div className="flex-1 min-w-0">
						<p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
							{file.name}
						</p>
						{file.size && (
							<p className="text-xs text-zinc-500 dark:text-zinc-400">
								{(file.size / 1024).toFixed(1)} KB
							</p>
						)}
					</div>
					{onRemove && (
						<button
							type="button"
							onClick={() => onRemove(file.id)}
							className="flex-shrink-0 p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
						>
							<HugeiconsIcon
								icon={Cancel01Icon}
								size={16}
								className="text-zinc-500"
							/>
						</button>
					)}
				</div>
			))}
		</div>
	);
};

export default FilePreview;
