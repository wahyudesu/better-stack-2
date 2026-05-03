import { Footer } from "@/components/footer";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "How to Start Using Social Media for Business in 2025 | ZenPost Blog",
  description:
    "Complete guide to starting your business's digital presence on social media. Platform selection, content strategy, and growth tactics for 2025.",
  alternates: {
    canonical: "https://zenpost.in/blog/memulai-social-media-untuk-bisnis",
  },
  openGraph: {
    title: "How to Start Using Social Media for Business in 2025",
    description:
      "A comprehensive guide to building your business's social media presence. From platform selection to content strategy.",
    url: "https://zenpost.in/blog/memulai-social-media-untuk-bisnis",
    type: "article",
  },
};

const post = {
  slug: "memulai-social-media-untuk-bisnis",
  title: "Cara Memulai Social Media untuk Bisnis di 2025",
  date: "15 April 2025",
  category: "Tips & Tricks",
  readTime: "5 min read",
  author: {
    name: "Reza Pratama",
    role: "Founder & CEO",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
  },
  content: `
    <p class="lead">Memulai kehadiran digital untuk bisnis mungkin terasa overwhelming, tapi dengan strategi yang tepat, kamu bisa membangun presence yang kuat di social media.</p>

    <h2>1. Tentukan Goals Kamu</h2>
    <p>Sebelum mulai posting, tentukan apa yang ingin kamu capai. Apakah ingin meningkatkan brand awareness, menghasilkan leads, atau langsung продаж? Setiap goal membutuhkan pendekatan yang berbeda.</p>

    <h2>2. Pilih Platform yang Tepat</h2>
    <p>Tidak perlu ada di semua platform. Fokus pada 2-3 platform where target audiens kamu paling aktif:</p>
    <ul>
      <li><strong>Instagram</strong> — Untuk bisnis dengan fokus visual</li>
      <li><strong>TikTok</strong> — Untuk menjangkau audiens muda</li>
      <li><strong>LinkedIn</strong> — Untuk B2B dan profesional</li>
    </ul>

    <h2>3. Buat Content Calendar</h2>
    <p>Rencana konten kamu minimal 1 bulan ke depan. Ini membantu menjaga konsistensi dan memastikan kamu selalu punya ide konten yang jelas.</p>

    <h2>4. Invest di Visual Quality</h2>
    <p>Konten visual yang bagus adalah kunci untuk menarik perhatian. Kamu tidak perlu equipment mahal — smartphone terbaru sudah cukup untuk menghasilkan foto dan video yang professional.</p>

    <h2>5. Engage dengan Audiens</h2>
    <p>Social media adalah jalan dua arah. Respond ke comments, reply ke messages, dan jangan takut untuk memulai conversation dengan followers kamu.</p>

    <h2>Kesimpulan</h2>
    <p>Konsistensi lebih penting daripada perfection. Mulai dari yang kecil, belajar dari data, dan terus iterate strategi kamu berdasarkan apa yang bekerja untuk bisnismu.</p>
  `,
};

export default function BlogPostPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <main className="flex-1">
        <article className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              {/* Back Link */}
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="size-4" />
                Back to Blog
              </Link>

              {/* Post Header */}
              <header className="space-y-4 mb-12">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-medium text-primary">{post.category}</span>
                  <span>·</span>
                  <span>{post.date}</span>
                  <span>·</span>
                  <span>{post.readTime}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
                  {post.title}
                </h1>
              </header>

              {/* Author */}
              <div className="flex items-center gap-4 pb-8 border-b border-border">
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-12 h-12 rounded-full bg-muted"
                />
                <div>
                  <p className="font-semibold">{post.author.name}</p>
                  <p className="text-sm text-muted-foreground">{post.author.role}</p>
                </div>
              </div>

              {/* Post Content */}
              <div
                className="prose prose-lg max-w-none pt-8 space-y-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
