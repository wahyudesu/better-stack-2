const pillarFeatures = [
  {
    title: "Satu dashboard, semua platform",
    description:
      "Hubungkan Instagram, TikTok, X, Facebook, dan YouTube di satu tempat. Tidak perlu bolak-balik login—semua metrik dan jadwal terkumpul rapi.",
    videoSrc: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  },
  {
    title: "Kolaborasi tim tanpa ribet",
    description:
      "Undang anggota tim, atur peran, dan kelola banyak akun bersama. Cocok untuk agensi dan brand dengan banyak saluran sosial.",
    videoSrc:
      "https://raw.githubusercontent.com/mdn/learning-area/master/html/multimedia-and-embedding/video-and-audio-content/rabbit320.mp4",
  },
  {
    title: "Notifikasi real time",
    description:
      "Tangkap komentar, DM, mention, dan lonjakan engagement lebih cepat. Satu kotak masuk notifikasi supaya tidak ada percakapan yang terlewat.",
    videoSrc: "https://samplelib.com/mp4/sample-5s.mp4",
  },
  {
    title: "Insight dan laporan siap bagikan",
    description:
      "Ringkasan harian atau mingguan, ekspor data, dan tren yang jelas untuk presentasi ke klien atau stakeholder internal.",
    videoSrc: "https://samplelib.com/mp4/sample-10s.mp4",
  },
] as const;

export function FeaturesDetail() {
  return (
    <div className="mx-auto mt-20 max-w-6xl border-border/60 pt-16 sm:mt-24 sm:pt-20" id="features">
      <div className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
        <h2 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          Empat pilar untuk operasional sosial yang tenang
        </h2>
        <p className="mt-3 text-pretty text-muted-foreground">
          Lihat alur singkat di setiap area: integrasi platform, tim, notifikasi, hingga laporan.
        </p>
      </div>

      <div className="grid gap-8 sm:gap-10 md:grid-cols-2">
        {pillarFeatures.map((feature) => (
          <article
            key={feature.title}
            className="flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-black/5 dark:ring-white/10"
          >
            <div className="border-b border-border/60 bg-muted/20 px-5 py-5 sm:px-6">
              <h3 className="text-balance text-lg font-semibold leading-snug sm:text-xl">{feature.title}</h3>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {feature.description}
              </p>
            </div>

            <div className="bg-muted/40 p-3 sm:p-4">
              <video
                className="aspect-video w-full rounded-xl border border-border bg-black object-cover shadow-inner"
                controls
                playsInline
                preload="none"
                aria-label={`Video demo: ${feature.title}`}
              >
                <source src={feature.videoSrc} type="video/mp4" />
              </video>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
