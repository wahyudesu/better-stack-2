import { User } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";

const Avatar = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement> & { size?: "sm" | "default" | "lg" }
>(({ className, size = "default", ...props }, ref) => (
	<span
		ref={ref}
		data-size={size}
		className={cn(
			"relative flex shrink-0 overflow-hidden rounded-full",
			"h-10 w-10 data-[size=sm]:h-6 data-[size=sm]:w-6 data-[size=lg]:h-12 data-[size=lg]:w-12",
			className,
		)}
		{...props}
	/>
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<
	HTMLImageElement,
	React.ImgHTMLAttributes<HTMLImageElement>
>(({ className, src, ...props }, ref) => {
	const [hasError, setHasError] = React.useState(false);

	if (hasError || !src) return null;

	return (
		<img
			ref={ref}
			src={src}
			className={cn("aspect-square h-full w-full object-cover", className)}
			onError={() => setHasError(true)}
			{...props}
		/>
	);
});
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<
	HTMLSpanElement,
	React.HTMLAttributes<HTMLSpanElement>
>(({ className, ...props }, ref) => (
	<span
		ref={ref}
		className={cn(
			"flex h-full w-full items-center justify-center rounded-full bg-muted text-sm font-medium",
			className,
		)}
		{...props}
	/>
));
AvatarFallback.displayName = "AvatarFallback";

const AvatarGroup = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn("flex -space-x-2", className)} {...props} />
));
AvatarGroup.displayName = "AvatarGroup";

export { Avatar, AvatarFallback, AvatarGroup, AvatarImage };
