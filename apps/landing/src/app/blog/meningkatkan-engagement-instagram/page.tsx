import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { CalendarIcon, ArrowLeft } from "lucide-react";
import Link from "next/link";

const post = {
  slug: "meningkatkan-engagement-instagram",
  title: "10 Tips Meningkatkan Engagement Instagram",
  date: "10 April 2025",
  category: "Instagram",
  readTime: "7 min read",
  author: {
    name: "Reza Pratama",
    role: "Founder & CEO",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=reza",
  },
  content: `
    <p class="lead">Engagement adalah jantung dari success Instagram. Tanpa interaksi yang kuat, algoritma tidak akan memprioritaskan konten kamu.</p>

    <h2>1. Post Konsisten</h2>
    <p>Konsistensi adalah kunci. Post minimal 3-4 kali seminggu untuk tetap visible di feeds followers kamu. Algoritma Instagram menyukai akun yang aktif.</p>

    <h2>2. Gunakan Reels</h2>
    <p>Instagram secara agresif mendorong konten Reels. Video pendek dengan hook yang kuat di 3 detik pertama bisa dramatically increase reach kamu.</p>

    <h2>3. Tulis Caption yang Engaging</h2>
    <p>Ajukan pertanyaan, minta opinions, atau mulai conversation di caption. Caption yang bagus mendorong orang untuk comment.</p>

    <h2>4. Timing itu Penting</h2>
    <p>Post saat audiens kamu paling aktif. Gunakan Instagram Insights untuk mengetahui kapan followers kamu online.</p>

    <h2>5. Reply Semua Komentar</h2>
    <p>Respond ke setiap komentar, termasuk yang dari akun kecil. Ini membangun community dan signals ke Instagram bahwa akun kamu engaging.</p>

    <h2>6. Gunakan Hashtags Strategis</h2>
    <p>Kombinasi hashtag yang tepat bisa meningkatkan discoverability. Campurkan hashtag besar, sedang, dan niche.</p>

    <h2>7. Collaborate dengan Others</h2>
    <p>Engage dengan konten orang lain di niche kamu. Comment meaningfully, share, dan collab untuk menjangkau audiens baru.</p>

    <h2>8. Buat Stories Secara Teratur</h2>
    <p>Stories menjaga kamu tetap di top of mind followers. Gunakan polling, quiz, dan interactive stickers untuk meningkatkan engagement.</p>

    <h2>9. Analisis dan Iterate</h2>
    <p>Gunakan Instagram Insights untuk melihat konten mana yang perform terbaik. Fokus pada format dan topik yang bekerja.</p>

    <h2>10. Jangan Terlalu Sales</h2>
    <p>Orang tidak follow untuk ditagih. Berikan nilai, entertain, atau educate terlebih dahulu sebelum melakukan selling.</p>

    <h2>Kesimpulan</h2>
    <p>Engagement yang tinggi tidak datang dari satu viral post. Ini adalah hasil dari effort konsisten dalam membangun community yang authentic.</p>
  `,
};

export default function BlogPostPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

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
                  <span className="flex items-center gap-1">
                    <CalendarIcon className="size-3.5" />
                    {post.date}
                  </span>
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
      </main>

      <Footer />
    </div>
  );
}
