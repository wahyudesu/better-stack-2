"use client";

const competitors = [
  "Zernio",
  "Sprout Social",
  "Postiz",
  "Hootsuite",
  "Meta Business Suite",
  "Buffer",
] as const;

type CellVariant = "check" | "partial" | "x";

function Cell({ variant, text }: { variant: CellVariant; text?: string }) {
  if (variant === "check") {
    return (
      <div className="flex items-center justify-center min-h-[38px]">
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
      <div className="flex items-center justify-center min-h-[38px]">
        <span className="text-[11px] font-medium text-text-secondary/70 px-2.5 py-1 rounded-full whitespace-nowrap bg-gray-100">
          {text}
        </span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-[38px]">
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

function CellZen({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center min-h-[38px]">
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
    feature: "Post publishing",
    zen: { variant: "check" as CellVariant, label: "Core" },
    data: [
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "partial" as CellVariant, text: "Partial" },
      { variant: "check" as CellVariant },
    ],
  },
  {
    feature: "Incoming Interactions",
    zen: { variant: "check" as CellVariant, label: "Core" },
    data: [
      { variant: "check" as CellVariant },
      { variant: "partial" as CellVariant, text: "Add-on" },
      { variant: "x" as CellVariant },
      { variant: "partial" as CellVariant, text: "Webhooks" },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
    ],
  },
  {
    feature: "Review Platforms",
    zen: { variant: "check" as CellVariant, label: "Core" },
    data: [
      { variant: "check" as CellVariant },
      { variant: "partial" as CellVariant, text: "Partial" },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
    ],
  },
  {
    feature: "Native MCP Server",
    zen: { variant: "check" as CellVariant, label: "Native" },
    data: [
      { variant: "check" as CellVariant },
      { variant: "partial" as CellVariant, text: "Deprecated" },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
    ],
  },
  {
    feature: "Free Tier",
    zen: { variant: "check" as CellVariant },
    data: [
      { variant: "check" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
    ],
  },
  {
    feature: "DM Support",
    zen: { variant: "check" as CellVariant },
    data: [
      { variant: "check" as CellVariant },
      { variant: "check" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
    ],
  },
  {
    feature: "Unified Schema",
    zen: { variant: "check" as CellVariant },
    data: [
      { variant: "check" as CellVariant },
      { variant: "partial" as CellVariant, text: "Partial" },
      { variant: "partial" as CellVariant, text: "Partial" },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
      { variant: "x" as CellVariant },
    ],
  },
];

const prices = ["$0/mo", "$249/mo", "$29/mo", "$99/mo", "$0/mo", "$6/mo"];

export function Comparison() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-text-primary mb-4">
            See how <span className="font-caveat text-green-primary italic text-[1.15em]">compare.</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            The only API that combines social interactions, reviews, and MCP. If you&apos;re evaluating
            an Ayrshare alternative focused on incoming interactions and review management rather than
            scheduling, the comparison below shows the key differences.
          </p>
        </div>

        <div className="overflow-x-auto">
          <div className="pt-6">
            <table className="w-full text-sm border-separate border-spacing-0">
              <thead>
                <tr>
                  <th className="w-44 pb-4 text-left"></th>
                  <th className="text-center font-semibold relative pb-4 px-2 align-bottom bg-green-muted/50 border-t-[2px] border-l-[2px] border-r-[2px] border-t-green-primary/25 border-l-green-primary/15 border-r-green-primary/15 rounded-tl-xl rounded-tr-xl text-green-dark pt-8">
                    <span className="absolute top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <span className="bg-green-primary text-white text-[9px] font-black tracking-widest uppercase px-3 py-1 rounded-full">
                        Best Value
                      </span>
                    </span>
                    <span className="text-[15px] font-bold">SocialAPI.ai</span>
                  </th>
                  {competitors.map((comp) => (
                    <th
                      key={comp}
                      className="text-center font-semibold relative pb-4 px-2 align-bottom text-text-secondary/75 pt-4"
                    >
                      <span className="text-[13px]">{comp}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.feature} className="group">
                    <td className="py-4 pr-6 font-medium text-text-primary/80 text-sm whitespace-nowrap border-b border-border-warm">
                      {row.feature}
                    </td>
                    <td className="py-4 px-3 text-center bg-green-muted/50 border-l-[2px] border-r-[2px] border-l-green-primary/15 border-r-green-primary/15 border-b border-b-green-primary/10">
                      <CellZen label={row.zen.label} />
                    </td>
                    {row.data.map((cell, colIndex) => (
                      <td
                        key={colIndex}
                        className="py-4 px-3 text-center border-b border-border-warm group-hover:bg-bg-warm/60"
                      >
                        <Cell variant={cell.variant} text={cell.text} />
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Starting Price Row */}
                <tr className="group">
                  <td className="py-4 pr-6 font-medium text-text-primary/80 text-sm whitespace-nowrap">
                    Starting Price
                  </td>
                  <td className="py-4 px-3 text-center bg-green-muted/50 border-l-[2px] border-r-[2px] border-l-green-primary/15 border-r-green-primary/15 border-b-[2px] border-b-green-primary/25 rounded-bl-xl rounded-br-xl">
                    <div className="flex items-center justify-center min-h-[38px]">
                      <span className="font-mono font-bold text-base text-green-primary">$0/mo</span>
                    </div>
                  </td>
                  {prices.slice(1).map((price, colIndex) => (
                    <td
                      key={colIndex}
                      className="py-4 px-3 text-center group-hover:bg-bg-warm/60"
                    >
                      <div className="flex items-center justify-center min-h-[38px]">
                        <span className="font-mono font-bold text-sm text-text-secondary/75">
                          {price}
                        </span>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-text-secondary/50 text-xs mt-6 text-center">
          Competitor pricing verified March 2026. Features based on published documentation.
        </p>
      </div>
    </section>
  );
}