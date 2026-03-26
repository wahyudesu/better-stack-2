"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface PostItem {
  id: string;
  platform: string;
  platformIcon: string;
  platformColor: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  caption: string;
  likes: string;
  comments: string;
  shares: string;
}

const defaultPosts: PostItem[] = [
  {
    id: "1",
    platform: "Twitter/X",
    platformIcon: "𝕏",
    platformColor: "bg-blue-500",
    emoji: "📱",
    gradientFrom: "from-blue-500",
    gradientTo: "to-purple-600",
    caption: "Excited to announce our new product launch! 🚀 #startup #tech",
    likes: "1.2K",
    comments: "89",
    shares: "234",
  },
  {
    id: "2",
    platform: "Instagram",
    platformIcon: "📷",
    platformColor: "bg-gradient-to-br from-purple-500 to-pink-500",
    emoji: "📸",
    gradientFrom: "from-pink-500",
    gradientTo: "to-orange-400",
    caption: "Behind the scenes at our office! Team work makes the dream work 💪",
    likes: "3.5K",
    comments: "156",
    shares: "42",
  },
  {
    id: "3",
    platform: "TikTok",
    platformIcon: "♪",
    platformColor: "bg-black",
    emoji: "🎵",
    gradientFrom: "from-red-500",
    gradientTo: "to-pink-600",
    caption: "Day in the life of a startup founder! #startuplife #entrepreneur",
    likes: "12.8K",
    comments: "892",
    shares: "1.5K",
  },
  {
    id: "4",
    platform: "LinkedIn",
    platformIcon: "in",
    platformColor: "bg-blue-700",
    emoji: "💼",
    gradientFrom: "from-blue-600",
    gradientTo: "to-blue-800",
    caption: "We're hiring! Join our growing team and build the future with us.",
    likes: "456",
    comments: "78",
    shares: "123",
  },
];

export interface RecentPostsCardProps {
  posts?: PostItem[];
  analyticsHref?: string;
}

export function RecentPostsCard({ posts = defaultPosts, analyticsHref = "/analytics" }: RecentPostsCardProps) {
  return (
    <div className="border rounded-lg p-3 sm:p-4">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h3 className="text-base font-semibold">Recent Posts</h3>
        <Link
          href={analyticsHref as any}
          className="inline-flex items-center gap-2 text-sm font-semibold hover:text-primary transition-colors group"
        >
          More Analytics
          <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post }: { post: PostItem }) {
  return (
    <div className="rounded-lg border overflow-hidden">
      <div className={`aspect-square bg-gradient-to-br ${post.gradientFrom} ${post.gradientTo} flex items-center justify-center`}>
        <span className="text-3xl sm:text-4xl">{post.emoji}</span>
      </div>
      <div className="p-2 sm:p-3">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
          <div
            className={`size-4 sm:size-5 rounded-full ${post.platformColor} flex items-center justify-center text-white text-[10px] sm:text-xs`}
          >
            {post.platformIcon}
          </div>
          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{post.platform}</span>
        </div>
        <p className="text-[11px] sm:text-sm line-clamp-2">{post.caption}</p>
        <div className="flex items-center gap-2 sm:gap-3 mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-muted-foreground">
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments}</span>
          <span>🔄 {post.shares}</span>
        </div>
      </div>
    </div>
  );
}
