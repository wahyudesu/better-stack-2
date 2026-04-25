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
];

const founder = {
  name: "Reza Pratama",
  role: "Founder & CEO",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
};

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16">
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

        {/* Blog Posts */}
        <section className="pb-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="space-y-12">
                {blogPosts.map((post) => (
                  <article key={post.slug} className="group">
                    <Link href={`/blog/${post.slug}`}>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="font-medium text-primary">{post.category}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="size-3.5" />
                            {post.date}
                          </span>
                          <span>·</span>
                          <span>{post.readTime}</span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-semibold group-hover:text-primary transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-muted-foreground leading-relaxed">
                          {post.excerpt}
                        </p>
                        <div className="text-sm font-medium text-primary">
                          Read more →
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Waitlist CTA */}
        <section className="py-16 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center space-y-4">
              <h2 className="text-2xl font-bold">
                Join Waitlist
              </h2>
              <p className="text-muted-foreground">
                Dapatkan akses early bird dan update terbaru tentang produk kami.
              </p>
              <Button size="lg" className="mt-4">
                <Link href="/" className="flex items-center gap-2">
                  Daftar Sekarang
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="py-12 border-t border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-md mx-auto">
              <div className="flex items-center gap-4">
                <img
                  src={founder.avatar}
                  alt={founder.name}
                  className="w-16 h-16 rounded-full bg-muted"
                />
                <div>
                  <p className="font-semibold">{founder.name}</p>
                  <p className="text-sm text-muted-foreground">{founder.role}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
