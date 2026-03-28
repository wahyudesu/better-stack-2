// Example usage of CreateContentDialog
// Add this to your dashboard or any page where you want to create posts

import { PlusIcon } from "lucide-react";
import { CreateContentDialog } from "@/components/features/create-content-dialog";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
	const handleCreatePost = (data: {
		content: string;
		platforms: (
			| "instagram"
			| "tiktok"
			| "twitter"
			| "linkedin"
			| "youtube"
			| "facebook"
			| "pinterest"
		)[];
		postType: "quick" | "custom";
		mode: "now" | "schedule";
		scheduledAt?: Date;
		media: Array<{
			id: string;
			name: string;
			size?: number;
			type?: string;
			file?: File;
			preview?: string;
		}>;
	}) => {
		console.log("Creating post:", data);

		// TODO: Save to Convex or your backend
		// Example with Convex (when ready):
		// await mutation(createPost, {
		//   content: data.content,
		//   platforms: data.platforms,
		//   status: data.mode === "now" ? "publishing" : "scheduled",
		//   scheduledAt: data.scheduledAt,
		//   media: data.media.map(m => ({ url: m.preview || "", type: m.type?.startsWith("image") ? "image" : "video" }))
		// });
	};

	return (
		<div className="p-6">
			{/* Using with trigger button */}
			<CreateContentDialog
				trigger={
					<Button>
						<PlusIcon className="size-4" />
						Create Post
					</Button>
				}
				onCreatePost={handleCreatePost}
			/>

			{/* Or control open state manually */}
			{/* <CreateContentDialog
				open={isOpen}
				onOpenChange={setIsOpen}
				onCreatePost={handleCreatePost}
			/> */}
		</div>
	);
}
