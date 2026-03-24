export const statusBadgeStyles: Record<string, { bg: string; text: string }> = {
  published: {
    bg: "hsl(142 76% 36% / 0.15)",
    text: "hsl(142 76% 36%)",
  },
  scheduled: {
    bg: "hsl(var(--primary) / 0.15)",
    text: "hsl(var(--primary))",
  },
  draft: {
    bg: "hsl(var(--muted) / 0.5)",
    text: "hsl(var(--muted-foreground))",
  },
  pending: {
    bg: "hsl(38 92% 50% / 0.15)",
    text: "hsl(38 92% 50%)",
  },
};
