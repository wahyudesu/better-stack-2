import { FileText, UserCheck, Wrench } from "lucide-react";
import Link from "next/link";

const groups = [
  {
    title: "Content Tools",
    description: "Tools untuk membuat dan mengelola konten",
    tools: [
      {
        id: "script-engine",
        label: "Content Script Engine",
        icon: FileText,
        description: "Generate AI system prompts untuk content creation",
        href: "/tools/script-engine" as const,
      },
      {
        id: "branding",
        label: "Personal Branding Builder",
        icon: UserCheck,
        description: "Build personal brand identity kamu",
        href: "/tools/branding" as const,
      },
    ],
  },
];

export default function ToolsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
        <p className="mt-2 text-muted-foreground">
          Kumpulan tools untuk membantu workflow kamu
        </p>
      </div>

      <div className="space-y-8">
        {groups.map((group) => (
          <div key={group.title}>
            <div className="mb-4 flex items-center gap-2">
              <Wrench className="size-4 text-muted-foreground" />
              <h2 className="text-lg font-semibold">{group.title}</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              {group.description}
            </p>
            <div className="grid gap-4 sm:grid-cols-2">
              {group.tools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group block rounded-xl border p-5 transition-all hover:border-primary/50 hover:bg-muted/50"
                >
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <tool.icon className="size-5 text-primary" />
                  </div>
                  <h3 className="font-medium group-hover:underline">
                    {tool.label}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        ))}

        <div className="rounded-xl border border-dashed p-6 text-center">
          <p className="text-muted-foreground mb-3">
            Butuh tool lain yang belum ada?
          </p>
          <Link
            href="https://tally.so/r/3lDEb9"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            Request Tool Baru
          </Link>
        </div>
      </div>
    </div>
  );
}