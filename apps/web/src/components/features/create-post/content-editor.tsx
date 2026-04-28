"use client";

import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { PostMedia } from "@/lib/types/social";

interface ContentEditorProps {
	value: string;
	onChange: (value: string) => void;
	media: PostMedia[];
	onMediaChange: (media: PostMedia[]) => void;
	maxChars?: number;
}

export function ContentEditor({
	value,
	onChange,
	media,
	onMediaChange,
	maxChars = 2200,
}: ContentEditorProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (!files) return;

		const newMedia: PostMedia[] = Array.from(files).map((file) => ({
			url: URL.createObjectURL(file),
			type: file.type.startsWith("video") ? "video" : "image",
			alt: file.name,
		}));

		onMediaChange([...media, ...newMedia]);
	};

	const removeMedia = (index: number) => {
		const updated = [...media];
		updated.splice(index, 1);
		onMediaChange(updated);
	};

	const handleDragOver = (e: React.DragEvent) => {
		if (e.dataTransfer.types.includes("Files")) {
			e.preventDefault();
		}
	};

	const handleDragEnter = (e: React.DragEvent) => {
		if (e.dataTransfer.types.includes("Files")) {
			e.preventDefault();
			setIsDragging(true);
		}
	};

	const handleDragLeave = (e: React.DragEvent) => {
		if (e.dataTransfer.types.includes("Files")) {
			e.preventDefault();
			const related = e.relatedTarget as HTMLElement | null;
			if (!related || !e.currentTarget.contains(related)) {
				setIsDragging(false);
			}
		}
	};

	const handleDrop = (e: React.DragEvent) => {
		if (e.dataTransfer.types.includes("Files")) {
			e.preventDefault();
			setIsDragging(false);

			const files = e.dataTransfer.files;
			if (files && files.length > 0) {
				const newMedia: PostMedia[] = Array.from(files).map((file) => ({
					url: URL.createObjectURL(file),
					type: file.type.startsWith("video") ? "video" : "image",
					alt: file.name,
				}));

				onMediaChange([...media, ...newMedia]);
			}
		}
	};

	return (
		<div
			className="space-y-3"
			onDragOver={handleDragOver}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">content</span>
				<span className="text-xs text-muted-foreground">
					{value.length}/{maxChars}
				</span>
			</div>
			<Textarea
				value={value}
				onChange={(e) => onChange(e.target.value)}
				placeholder="Write your post content..."
				className={`min-h-[120px] resize-none transition-colors ${
					isDragging ? "border-primary border-dashed bg-primary/5" : ""
				}`}
			/>
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				accept="image/*,video/*"
				multiple
				className="hidden"
			/>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => fileInputRef.current?.click()}
			>
				Add media
			</Button>
			{media.length > 0 && (
				<div className="grid grid-cols-3 gap-2 pt-2">
					{media.map((m, i) => (
						<div key={i} className="relative group">
							{m.type === "image" ? (
								<img
									src={m.url}
									alt={m.alt}
									className="w-full h-20 object-cover rounded-lg"
								/>
							) : (
								<video
									src={m.url}
									className="w-full h-20 object-cover rounded-lg"
								/>
							)}
							<button
								type="button"
								onClick={() => removeMedia(i)}
								className="absolute top-1 right-1 p-1 bg-black/60 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
							>
								<X className="w-3 h-3" />
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
