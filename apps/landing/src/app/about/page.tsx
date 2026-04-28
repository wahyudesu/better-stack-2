import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { UsersIcon, TargetIcon, HeartIcon, ZapIcon } from "lucide-react";

const teamMembers = [
  {
    name: "Rizki Pratama",
    role: "Co-Founder & CEO",
    bio: "Ex-product manager dengan pengalaman 8+ tahun di tech industry. Passionate soal creator economy.",
    avatar: "👨‍💼",
  },
  {
    name: "Sarah Wijaya",
    role: "Co-Founder & CTO",
    bio: "Full-stack engineer yang sebelumnya bekerja di Google dan Meta. Spesialis scalable systems.",
    avatar: "👩‍💻",
  },
  {
    name: "Andre Tanoto",
    role: "Head of Design",
    bio: "Design lead dengan background di agency dan startup. Fokus di user experience dan product design.",
    avatar: "🎨",
  },
  {
    name: "Maya Kusuma",
    role: "Head of Marketing",
    bio: "Digital marketing strategist dengan track record 5+ tahun membantu brands tumbuh di Indonesia.",
    avatar: "📈",
  },
];

const values = [
  {
    icon: <UsersIcon className="size-6" />,
    title: "Creator-First",
    description: "Every feature we build starts with understanding how creators work and what they need.",
  },
  {
    icon: <TargetIcon className="size-6" />,
    title: "Simplicity",
    description: "We believe powerful tools don't need to be complicated. Simple by design, powerful by nature.",
  },
  {
    icon: <HeartIcon className="size-6" />,
    title: "Community",
    description: "We're building alongside our users. Your feedback shapes ZenPost.",
  },
  {
    icon: <ZapIcon className="size-6" />,
    title: "Innovation",
    description: "We leverage AI and modern tech to solve real problems faced by social media managers.",
  },
];

const stats = [
  { value: "10,000+", label: "Active Users" },
  { value: "50M+", label: "Posts Scheduled" },
  { value: "95%", label: "Customer Satisfaction" },
  { value: "3-5 hrs", label: "Time Saved Weekly" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h1 className="text-4xl sm:text-5xl font-bold mb-4">
                About ZenPost
              </h1>
              <p className="text-xl text-secondary-foreground/70 mb-8">
                We&apos;re building the future of social media management untuk creator dan bisnis Indonesia.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg">Join Our Team</Button>
                <Button variant="outline" size="lg">Contact Us</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Story</h2>
                <p className="text-muted-foreground">
                  From frustration to innovation
                </p>
              </div>
              <div className="bg-card border border-border rounded-xl p-8 md:p-12 space-y-6">
                <p className="text-lg text-muted-foreground">
                  ZenPost dimulai dari satu masalah sederhana: kami capek manage multiple social media accounts satu per satu. Login ke 5+ apps, scroll-scroll-scroll cari content, forgot to post, missed analytics...
                </p>
                <p className="text-lg text-muted-foreground">
                  Di awal 2024, kami memutuskan untuk bangun solusi sendiri. Dari最初 hanya tool untuk tim kecil, sekarang ZenPost udah digunakan oleh thousands of creators dan businesses di Indonesia.
                </p>
                <p className="text-lg text-muted-foreground">
                  Kami percaya bahwa social media management shouldn&apos;t be complicated. Dengan AI dan automation, kami membantu creator fokus di what they do best: creating great content.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16 bg-secondary text-secondary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Our Values</h2>
                <p className="text-secondary-foreground/70">
                  Principles that guide everything we do
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value) => (
                  <div
                    key={value.title}
                    className="bg-card/50 rounded-xl p-6 text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4 text-primary">
                      {value.icon}
                    </div>
                    <h3 className="font-semibold mb-2 text-foreground">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
                <p className="text-muted-foreground">
                  The people behind ZenPost
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member) => (
                  <div
                    key={member.name}
                    className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                  >
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4 text-4xl">
                      {member.avatar}
                    </div>
                    <h3 className="font-semibold mb-1">{member.name}</h3>
                    <p className="text-sm text-primary mb-3">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-4">
                Mau Bergabung dengan Tim Kami?
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                Kami sedang looking for talented individuals yang passionate soal продукту dan creator economy.
              </p>
              <Button size="lg" variant="secondary">
                View Open Positions
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
