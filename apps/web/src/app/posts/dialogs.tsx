import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { useDeletePost, useUnpublishPost } from "@/hooks/use-posts";
import { api } from "@/lib/client";
import type { CalendarEvent } from "./utils";

interface LogsDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event: CalendarEvent | null;
}

export function LogsDialog({ open, onOpenChange, event }: LogsDialogProps) {
	const [postLogs, setPostLogs] = useState<any[]>([]);
	const [logsLoading, setLogsLoading] = useState(false);

	useEffect(() => {
		if (!open || !event) return;
		setLogsLoading(true);
		api
			.getPostLogs(event.id)
			.then(({ data, error }) => {
				if (error) toast.error(`Failed to load logs: ${error}`);
				else setPostLogs(data?.logs || []);
			})
			.finally(() => setLogsLoading(false));
	}, [open, event]);

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg">
				<DialogHeader>
					<DialogTitle>Post Logs</DialogTitle>
				</DialogHeader>
				{logsLoading ? (
					<div className="py-8 text-center text-muted-foreground text-sm">
						Loading logs...
					</div>
				) : postLogs.length === 0 ? (
					<div className="py-8 text-center text-muted-foreground text-sm">
						No logs available
					</div>
				) : (
					<div className="max-h-80 overflow-y-auto space-y-2">
						{postLogs.map((log: any, i: number) => (
							<div
								key={i}
								className="text-sm p-2 rounded-md bg-muted/50 border"
							>
								<div className="flex items-center justify-between">
									<span className="font-medium text-xs uppercase">
										{log.status || log.level || "info"}
									</span>
									<span className="text-xs text-muted-foreground">
										{log.createdAt
											? new Date(log.createdAt).toLocaleString()
											: ""}
									</span>
								</div>
								<p className="text-sm mt-1">{log.message || log.text}</p>
							</div>
						))}
					</div>
				)}
			</DialogContent>
		</Dialog>
	);
}

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	onConfirm: () => void;
	destructive?: boolean;
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	onConfirm,
	destructive = false,
}: ConfirmDialogProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					<AlertDialogDescription>{description}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						className={
							destructive ? "bg-destructive hover:bg-destructive/90" : undefined
						}
					>
						Confirm
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

interface DeleteDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event: CalendarEvent | null;
	onDeleted: () => void;
}

export function DeleteDialog({
	open,
	onOpenChange,
	event,
	onDeleted,
}: DeleteDialogProps) {
	const { mutate: deletePost, isPending } = useDeletePost();

	const handleConfirm = () => {
		if (!event) return;
		deletePost(event.id, {
			onSuccess: () => {
				toast.success("Post deleted");
				onOpenChange(false);
				onDeleted();
			},
			onError: (err) => toast.error(`Failed to delete: ${err.message}`),
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Post</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to delete this post? This action cannot be
						undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleConfirm}
						disabled={isPending}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						Delete
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

interface UnpublishDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	event: CalendarEvent | null;
	onUnpublished: () => void;
}

export function UnpublishDialog({
	open,
	onOpenChange,
	event,
	onUnpublished,
}: UnpublishDialogProps) {
	const { mutate: unpublishPost, isPending } = useUnpublishPost();

	const handleConfirm = () => {
		if (!event) return;
		unpublishPost(event.id, {
			onSuccess: () => {
				toast.success("Post unpublished");
				onOpenChange(false);
				onUnpublished();
			},
			onError: (err) => toast.error(`Failed to unpublish: ${err.message}`),
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Unpublish Post</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to unpublish this post? It will be removed
						from your social accounts.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>Cancel</AlertDialogCancel>
					<AlertDialogAction onClick={handleConfirm} disabled={isPending}>
						Unpublish
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
