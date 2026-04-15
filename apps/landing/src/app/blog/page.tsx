import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import Link from "next/link";

const blogPosts = [
  {
    slug: "memulai-social-media-untuk-bisnis",
    title: "Cara Memulai Social Media untuk Bisnis di 2025",
    excerpt: "Panduan lengkap untuk memulai presence digital bisnis kamu. Dari pemilihan platform hingga strategi konten yang efektif.",
    date: "15 April 2025",
    category: "Tips & Tricks",
    readTime: "5 min read",
  },
  {
    slug: "meningkatkan-engagement-instagram",
    title: "10 Tips Meningkatkan Engagement Instagram",
    excerpt: "Temukan strategi terbukti untuk meningkatkan interaksi followers di Instagram. Mulai dari konten visuel hingga timing posting yang optimal.",
    date: "10 April 2025",
    category: "Instagram",
    readTime: "7 min read",
  },
  {
    slug: "ai-dalam-social-media-management",
    title: "Bagaimana AI Mengubah Cara Kita Manage Social Media",
    excerpt: "Explorasi bagaimana teknologi AI dapat membantu streamline workflow social media dan meningkatkan produktivitas.",
    date: "5 April 2025",
    category: "Technology",
    readTime: "6 min read",
  },
  {
    slug: "content-calendar-template",
    title: "Content Calendar Template Gratis untuk Creator",
    excerpt: "Download template content calendar yang bisa langsung kamu pakai untuk merencanakan konten bulanan.",
    date: "1 April 2025",
    category: "Resources",
    readTime: "3 min read",
  },
  {
    slug: "analisis-hashtag-tiktok-2025",
    title: "Analisis Tren Hashtag TikTok 2025",
    excerpt: "Update tren hashtag TikTok terbaru dan bagaimana menggunakannya untuk menjangkau audiens yang lebih luas.",
    date: "28 Maret 2025",
    category: "TikTok",
    readTime: "4 min read",
  },
  {
    slug: "multi-platform-social-media-strategy",
    title: "Strategy Social Media Multi-Platform",
    excerpt: "Bagaimana cara manage multiple social media platforms sekaligus tanpa kehilangan头发 (sanity). Tips dan tools yang kami gunakan.",
    date: "20 Maret 2025",
    category: "Strategy",
    readTime: "8 min read",
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                Blog
              </h1>
              <p className="text-xl text-secondary-foreground/70 mb-8">
                Tips, tricks, dan insights tentang social media management untuk creator dan bisnis Indonesia.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Button variant="outline" size="sm">All Posts</Button>
                <Button variant="ghost" size="sm">Tips & Tricks</Button>
                <Button variant="ghost" size="sm">Instagram</Button>
                <Button variant="ghost" size="sm">TikTok</Button>
                <Button variant="ghost" size="sm">Strategy</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Blog Posts Grid */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <article
                    key={post.slug}
                    className="group bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Placeholder image area */}
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <span className="text-4xl opacity-50">📝</span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <CalendarIcon className="size-3.5" />
                          {post.date}
                        </span>
                      </div>
                      <h2 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        <Link href="/blog">
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">{post.readTime}</span>
                        <Button variant="ghost" size="sm" className="text-primary">
                          Read more →
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-12">
                <Button variant="outline" size="lg">
                  Load More Posts
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-16 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Subscribe ke Newsletter Kami
              </h2>
              <p className="text-secondary-foreground/70 mb-6">
                Dapatkan tips terbaru langsung ke email kamu. No spam, unsubscribe anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
