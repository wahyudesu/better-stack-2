"use client";

const features = [
  {
    id: 1,
    description: "Pantau semua metrik media sosial di satu tempat dengan visualisasi data yang mudah dipahami.",
  },
  {
    id: 2,
    description: "Jadwalkan posting dengan waktu optimal untuk menjangkau audiens secara maksimal.",
  },
  {
    id: 3,
    description: "Buat konten berkualitas tinggi dengan bantuan AI yang memahami tren dan preferensi audiens.",
  },
];

export function Features() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-center gap-8 sm:gap-12">
          {features.map((feature) => (
            <div key={feature.id} className="flex-1 max-w-[280px] text-center">
              <p className="text-md text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

