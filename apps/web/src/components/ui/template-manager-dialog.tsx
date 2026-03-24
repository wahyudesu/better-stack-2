"use client";

import { useState, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
	Delete02Icon,
	FloppyDiskIcon,
	Add01Icon,
	Cancel01Icon,
	Copy02Icon,
} from "@/lib/utils/tool-icons";
import { cn } from "@/lib/utils";
import type { ComposerTemplate, TemplateManager } from "@/lib/types/template";

export interface TemplateManagerDialogProps {
	isOpen: boolean;
	onClose: () => void;
	templateManager: TemplateManager;
	onLoadTemplate: (template: ComposerTemplate) => void;
	currentConfig?: {
		platform?: string;
		contentType?: string;
		goal?: string;
		tone?: string;
		message?: string;
	};
}

export function TemplateManagerDialog({
	isOpen,
	onClose,
	templateManager,
	onLoadTemplate,
	currentConfig,
}: TemplateManagerDialogProps) {
	const [templates, setTemplates] = useState<ComposerTemplate[]>([]);
	const [newTemplateName, setNewTemplateName] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	useEffect(() => {
		if (isOpen) {
			setTemplates([...templateManager.templates]);
		}
	}, [isOpen, templateManager.templates]);

	const handleSaveTemplate = () => {
		if (!newTemplateName.trim()) return;

		templateManager.saveTemplate({
			name: newTemplateName.trim(),
			...currentConfig,
		});

		setNewTemplateName("");
		setIsCreating(false);
		setTemplates([...templateManager.templates]);
	};

	const handleDeleteTemplate = (id: string) => {
		templateManager.deleteTemplate(id);
		setTemplates(templates.filter((t) => t.id !== id));
	};

	const handleLoadTemplate = (template: ComposerTemplate) => {
		onLoadTemplate(template);
		onClose();
	};

	const handleDuplicateTemplate = (template: ComposerTemplate) => {
		templateManager.saveTemplate({
			name: `${template.name} (Copy)`,
			platform: template.platform,
			contentType: template.contentType,
			goal: template.goal,
			tone: template.tone,
			message: template.message,
		});
		setTemplates([...templateManager.templates]);
	};

	if (!isOpen) return null;

	return (
		<>
			{/* Backdrop */}
			<div
				className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 animate-in fade-in-0"
				onClick={onClose}
			/>

			{/* Dialog */}
			<div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md animate-in fade-in-0 zoom-in-95 duration-150">
				<div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
					{/* Header */}
					<div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
						<div className="flex items-center gap-2">
							<HugeiconsIcon
								icon={FloppyDiskIcon}
								size={20}
								className="text-zinc-500 dark:text-zinc-400"
							/>
							<h2 className="font-semibold text-zinc-900 dark:text-white">
								Templates
							</h2>
							<span className="text-xs text-zinc-500 dark:text-zinc-400">
								({templates.length})
							</span>
						</div>
						<button
							type="button"
							onClick={onClose}
							className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
						>
							<HugeiconsIcon
								icon={Cancel01Icon}
								size={18}
								className="text-zinc-500 dark:text-zinc-400"
							/>
						</button>
					</div>

					{/* Content */}
					<div className="max-h-[400px] overflow-y-auto p-4 space-y-2">
						{/* Save Current as Template */}
						{!isCreating && currentConfig && (
							<button
								type="button"
								onClick={() => setIsCreating(true)}
								className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
							>
								<div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
									<HugeiconsIcon
										icon={Add01Icon}
										size={18}
										className="text-primary group-hover:scale-110 transition-transform"
									/>
								</div>
								<div className="text-left">
									<div className="text-sm font-medium text-zinc-900 dark:text-white">
										Save current as template
									</div>
									<div className="text-xs text-zinc-500 dark:text-zinc-400">
										Save your current configuration
									</div>
								</div>
							</button>
						)}

						{/* Create New Template Form */}
						{isCreating && (
							<div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700">
								<label className="text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
									Template Name
								</label>
								<div className="flex gap-2">
									<input
										type="text"
										value={newTemplateName}
										onChange={(e) => setNewTemplateName(e.target.value)}
										placeholder="e.g., Instagram Promo Post"
										className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 focus:outline-none focus:border-primary/50"
										onKeyDown={(e) => {
											if (e.key === "Enter") handleSaveTemplate();
											if (e.key === "Escape") {
												setIsCreating(false);
												setNewTemplateName("");
											}
										}}
										autoFocus
									/>
									<button
										type="button"
										onClick={handleSaveTemplate}
										disabled={!newTemplateName.trim()}
										className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors"
									>
										Save
									</button>
								</div>
								<button
									type="button"
									onClick={() => {
										setIsCreating(false);
										setNewTemplateName("");
									}}
									className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors cursor-pointer"
								>
									Cancel
								</button>
							</div>
						)}

						{/* Templates List */}
						{templates.length === 0 && !isCreating && (
							<div className="text-center py-8">
								<p className="text-sm text-zinc-500 dark:text-zinc-400">
									No templates yet. Create your first template!
								</p>
							</div>
						)}

						{templates.map((template) => (
							<div
								key={template.id}
								className="group relative p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
							>
								<div className="flex items-start justify-between gap-3">
									<button
										type="button"
										onClick={() => handleLoadTemplate(template)}
										className="flex-1 text-left cursor-pointer"
									>
										<div className="font-medium text-zinc-900 dark:text-white">
											{template.name}
										</div>
										{/* Template Details */}
										<div className="flex flex-wrap gap-1.5 mt-2">
											{template.platform && (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
													{template.platform}
												</span>
											)}
											{template.contentType && (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
													{template.contentType}
												</span>
											)}
											{template.goal && (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
													{template.goal}
												</span>
											)}
											{template.tone && (
												<span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300">
													{template.tone}
												</span>
											)}
										</div>
										{template.message && (
											<div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">
												"{template.message.slice(0, 60)}{template.message.length > 60 ? "..." : ""}"
											</div>
										)}
									</button>

									{/* Actions */}
									<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
										<button
											type="button"
											onClick={() => handleDuplicateTemplate(template)}
											className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
											title="Duplicate template"
										>
											<HugeiconsIcon
												icon={Copy02Icon}
												size={16}
												className="text-zinc-500 dark:text-zinc-400"
											/>
										</button>
										<button
											type="button"
											onClick={() => handleDeleteTemplate(template.id)}
											className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors cursor-pointer"
											title="Delete template"
										>
											<HugeiconsIcon
												icon={Delete02Icon}
												size={16}
												className="text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400"
											/>
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</>
		);
}

export default TemplateManagerDialog;
