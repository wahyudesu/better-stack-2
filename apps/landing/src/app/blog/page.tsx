import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog - Social Media Management Insights",
  description:
    "Tips, strategies, and insights about social media management for Indonesian creators and businesses. Learn how to grow your social presence.",
  alternates: {
    canonical: "https://zenpost.in/blog",
  },
  openGraph: {
    title: "ZenPost Blog - Social Media Insights",
    description:
      "Tips and strategies for social media management. Learn how to grow your audience and save time.",
    url: "https://zenpost.in/blog",
    type: "website",
  },
};

const blogPosts = [
  {
    slug: "memulai-social-media-untuk-bisnis",
    title: "Cara Memulai Social Media untuk Bisnis di 2025",
    excerpt: "Panduan lengkap untuk memulai presence digital bisnis kamu. Dari pemilihan platform hingga strategi konten yang efektif.",
    date: "15 April 2025",
    tags: ["Tips & Tricks", "Social Media"],
    readTime: "5 min read",
    cover: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
    author: {
      name: "Reza Pratama",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
    },
  },
  {
    slug: "meningkatkan-engagement-instagram",
    title: "10 Tips Meningkatkan Engagement Instagram",
    excerpt: "Temukan strategi terbukti untuk meningkatkan interaksi followers di Instagram. Mulai dari konten visuel hingga timing posting yang optimal.",
    date: "10 April 2025",
    tags: ["Instagram", "Engagement"],
    readTime: "7 min read",
    cover: "https://images.unsplash.com/photo-1611262588024-d12430b98921?w=800&h=450&fit=crop",
    author: {
      name: "Reza Pratama",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
    },
  },
  {
    slug: "ai-dalam-social-media-management",
    title: "Bagaimana AI Mengubah Cara Kita Manage Social Media",
    excerpt: "Explorasi bagaimana teknologi AI dapat membantu streamline workflow social media dan meningkatkan produktivitas.",
    date: "5 April 2025",
    tags: ["Technology", "AI"],
    readTime: "6 min read",
    cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    author: {
      name: "Reza Pratama",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
    },
  },
  {
    slug: "memulai-social-media-untuk-bisnis",
    title: "Cara Memulai Social Media untuk Bisnis di 2025",
    excerpt: "Panduan lengkap untuk memulai presence digital bisnis kamu. Dari pemilihan platform hingga strategi konten yang efektif.",
    date: "15 April 2025",
    tags: ["Tips & Tricks", "Social Media"],
    readTime: "5 min read",
    cover: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=450&fit=crop",
    author: {
      name: "Reza Pratama",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
    },
  },
  {
    slug: "meningkatkan-engagement-instagram",
    title: "10 Tips Meningkatkan Engagement Instagram",
    excerpt: "Temukan strategi terbukti untuk meningkatkan interaksi followers di Instagram. Mulai dari konten visuel hingga timing posting yang optimal.",
    date: "10 April 2025",
    tags: ["Instagram", "Engagement"],
    readTime: "7 min read",
    cover: "https://images.unsplash.com/photo-1611262588024-d12430b98921?w=800&h=450&fit=crop",
    author: {
      name: "Reza Pratama",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
    },
  },
  {
    slug: "ai-dalam-social-media-management",
    title: "Bagaimana AI Mengubah Cara Kita Manage Social Media",
    excerpt: "Explorasi bagaimana teknologi AI dapat membantu streamline workflow social media dan meningkatkan produktivitas.",
    date: "5 April 2025",
    tags: ["Technology", "AI"],
    readTime: "6 min read",
    cover: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop",
    author: {
      name: "Reza Pratama",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
    },
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-12 pb-8">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                Blog
              </h1>
              <p className="text-muted-foreground">
                Insights tentang social media management untuk creator dan bisnis.
              </p>
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <article key={post.slug} className="group">
                    <Link href={`/blog/${post.slug}` as any} className="block space-y-3">
                      {/* Cover */}
                      <div className="aspect-[16/10] overflow-hidden rounded-lg">
                        <img
                          src={post.cover}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {post.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Title */}
                        <h2 className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.excerpt}
                        </p>

                        {/* Meta */}
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <img
                              src={post.author.avatar}
                              alt={post.author.name}
                              className="w-6 h-6 rounded-full bg-muted"
                            />
                            <span className="text-xs text-muted-foreground">
                              {post.author.name}
                            </span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {post.date}
                          </span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
