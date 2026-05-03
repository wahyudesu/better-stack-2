"use client";

const features = [
  {
    id: 1,
    description: "Monitor all social media metrics in one place with easy-to-understand data visualizations.",
  },
  {
    id: 2,
    description: "Schedule posts at optimal times to reach your audience when they're most active.",
  },
  {
    id: 3,
    description: "Create high-quality content with AI that understands trends and audience preferences.",
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

