"use client";

const competitors = ["Postiz", "Repliz", "Buffer", "Meta Business Suite"] as const;

type CellVariant = "check" | "partial" | "x" | "text";

function Cell({ variant, text }: { variant: CellVariant; text?: string }) {
  if (variant === "check") {
    return (
      <div className="flex items-center justify-center min-h-[28px]">
        <span className="text-emerald-600/70">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.13" />
            <path
              d="M6.5 10.2L8.9 12.6L13.5 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    );
  }

  if (variant === "partial") {
    return (
      <div className="flex items-center justify-center min-h-[28px]">
        <span className="text-[11px] font-medium text-text-secondary/70 px-2.5 py-1 rounded-full whitespace-nowrap bg-gray-100">
          {text}
        </span>
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className="flex items-center justify-center min-h-[28px]">
        <span className="text-[11px] sm:text-[13px] text-text-secondary/80">{text}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[28px]">
      <span className="text-text-secondary/40">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path
            d="M7 7L13 13M13 7L7 13"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
}

function CellZen({ label, text }: { label?: string; text?: string }) {
  if (text) {
    return (
      <div className="flex items-center justify-center min-h-[28px]">
        <span className="text-[11px] sm:text-[13px] font-medium text-green-primary">{text}</span>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-[28px]">
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-green-primary">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <circle cx="10" cy="10" r="9" fill="currentColor" fillOpacity="0.13" />
            <path
              d="M6.5 10.2L8.9 12.6L13.5 7.5"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {label && (
          <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-primary/10 text-green-primary">
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

const rows = [
  {
    feature: "App integrations",
    zen: { variant: "text" as CellVariant, text: "15+" },
    data: [
      { variant: "text" as CellVariant, text: "Quite many" },
      { variant: "text" as CellVariant, text: "API-focused" },
      { variant: "text" as CellVariant, text: "Limited" },
      { variant: "text" as CellVariant, text: "Meta only" },
    ],
  },
  {
    feature: "Ads integrations",
    zen: { variant: "check" as CellVariant, label: "Core" },
    data: [
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "check" as CellVariant },
    ],
  },
  {
    feature: "Comment to DM",
    zen: { variant: "check" as CellVariant, label: "Core" },
    data: [
      { variant: "x" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "partial" as CellVariant, text: "Inbox" },
    ],
  },
  {
    feature: "Analytics",
    zen: { variant: "check" as CellVariant },
    data: [
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
    ],
  },
  {
    feature: "CRM built-in",
    zen: { variant: "check" as CellVariant, label: "Native" },
    data: [
      { variant: "x" as CellVariant },
      { variant: "partial" as CellVariant, text: "Partial" },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
    ],
  },
  {
    feature: "Team members",
    zen: { variant: "text" as CellVariant, text: "Unlimited" },
    data: [
      { variant: "text" as CellVariant, text: "Limited by plan" },
      { variant: "text" as CellVariant, text: "Depends" },
      { variant: "text" as CellVariant, text: "Limited" },
      { variant: "text" as CellVariant, text: "Limited" },
    ],
  },
];

export function Comparison() {
  return (
    <section className="py-16 sm:py-24 px-3 sm:px-6 lg:px-8 bg-bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-text-primary mb-4">
            See how <span className="font-caveat text-green-primary italic text-[1.15em]">compare.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            The only all-in-one platform that combines social analytics, inbox management, ads tracking, and CRM.
            Stop juggling multiple tools — everything you need in one dashboard.
          </p>
        </div>

        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="pt-6">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="w-24 lg:w-32 pb-4 text-left"></th>
                  <th className="w-16 sm:w-20 text-center font-semibold relative pb-4 px-1 sm:px-2 align-bottom bg-green-muted/50 border-t-[2px] border-l-[2px] border-r-[2px] border-t-green-primary/25 border-l-green-primary/15 border-r-green-primary/15 rounded-tl-xl rounded-tr-xl text-green-dark pt-8">
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="bg-green-primary text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                        Best Value
                      </span>
                    </span>
                    <span className="text-[15px] font-bold">Zenpost</span>
                  </th>
                  {competitors.map((comp) => (
                    <th
                      key={comp}
                      className="w-14 sm:w-16 text-center font-semibold relative pb-4 px-1 align-bottom text-text-secondary/75 pt-4"
                    >
                      <span className="text-[11px] sm:text-[13px]">{comp}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="group">
                    <td className="py-2.5 pr-2 font-medium text-text-primary/80 text-sm whitespace-nowrap border-b border-border-warm">
                      {row.feature}
                    </td>
                    <td className="py-2.5 px-1 sm:px-2 text-center bg-green-muted/50 border-l-[2px] border-r-[2px] border-l-green-primary/15 border-r-green-primary/15 border-b border-b-green-primary/10">
                      <CellZen label={row.zen.label} text={row.zen.text} />
                    </td>
                    {row.data.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className="py-2.5 px-1 text-center border-b border-border-warm group-hover:bg-bg-warm/60"
                      >
                        <Cell variant={cell.variant} text={cell.text} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-text-secondary/50 text-xs mt-6 text-center">
          Features based on published documentation and user research, May 2026.
        </p>
      </div>
    </section>
  );
}
