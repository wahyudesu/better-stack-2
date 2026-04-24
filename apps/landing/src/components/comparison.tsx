"use client";

import { cn } from "@/lib/utils";

const products = [
  { name: "ZenPost", highlighted: true },
  { name: "GA", highlighted: false },
  { name: "Plausible", highlighted: false },
  { name: "Fathom", highlighted: false },
];

const features = [
  {
    name: "GDPR compliant",
    values: [true, true, true, true],
  },
  {
    name: "No cookie banner",
    values: [true, false, true, true],
  },
  {
    name: "Revenue attribution",
    values: [true, false, false, false],
  },
  {
    name: "Realtime analytics",
    values: [true, false, false, false],
  },
  {
    name: "Visitor journeys",
    values: [true, false, false, false],
  },
  {
    name: "User identification",
    values: [true, false, false, false],
  },
  {
    name: "Performance insights",
    values: [true, false, false, false],
  },
  {
    name: "Funnel analysis",
    values: [true, true, true, false],
  },
];

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 16 16"
    className={cn("inline-flex", className)}
    aria-hidden="true"
  >
    <path
      d="M8 15C11.866 15 15 11.866 15 8C15 4.13401 11.866 1 8 1C4.13401 1 1 4.13401 1 8C1 11.866 4.13401 15 8 15Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.78516 8.69855L6.91353 10.8378L10.4608 5.54053"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg
    width="20"
    height="20"
    fill="none"
    viewBox="0 0 16 16"
    className={cn("inline-flex", className)}
    aria-hidden="true"
  >
    <path
      d="M3.05131 3.05025L8.00106 8M8.00106 8L12.9508 12.9497M8.00106 8L3.05131 12.9497M8.00106 8L12.9508 3.05025"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export function Comparison() {
  return (
    <section className="py-24 bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              Comparison
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-4">
              ZenPost vs Others
            </h2>
            <p className="text-secondary-foreground/70">
              Lihat keunggulan ZenPost dibanding tools lain
            </p>
          </div>

          {/* Comparison table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full table-fixed text-left border-collapse">
              <colgroup>
                <col style={{ width: "50%" }} />
                <col style={{ width: "12.5%" }} />
                <col style={{ width: "12.5%" }} />
                <col style={{ width: "12.5%" }} />
                <col style={{ width: "12.5%" }} />
              </colgroup>

              {/* Header row */}
              <thead>
                <tr className="align-top">
                  <th className="p-4"></th>
                  {products.map((product, i) => (
                    <th key={i} className="p-0 align-top" scope="col">
                      <div
                        className={cn(
                          "w-full h-full p-4 flex flex-col items-center gap-2 text-sm font-medium rounded-t-3xl border-2 border-b-0",
                          product.highlighted
                            ? "bg-primary/10 border-primary text-primary"
                            : "bg-background border-border text-foreground"
                        )}
                      >
                        {product.highlighted && (
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 32 32"
                            fill="none"
                            className="shrink-0"
                          >
                            <path
                              d="M16 3C27 3 31 10 31 16C31 22 27 29 16 29C5 29 1 22 1 16C1 10 5 3 16 3ZM15 9C11.134 9 8 12.134 8 16C8 19.866 11.134 23 15 23H17C20.866 23 24 19.866 24 16C24 12.134 20.866 9 17 9H15Z"
                              fill="currentColor"
                            />
                          </svg>
                        )}
                        {!product.highlighted && (
                          <svg
                            width="32"
                            height="32"
                            viewBox="0 0 16 16"
                            fill="none"
                            className="shrink-0 text-muted-foreground"
                          >
                            <path
                              d="M3.05131 3.05025L8.00106 8M8.00106 8L12.9508 12.9497M8.00106 8L3.05131 12.9497M8.00106 8L12.9508 3.05025"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                        {product.name}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Body rows */}
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={feature.name}
                    className={cn(
                      "border-b border-border last:border-b-0",
                      index % 2 === 0 ? "bg-muted/30" : "bg-transparent"
                    )}
                  >
                    <th scope="row" className="p-4 pl-0 font-normal align-middle">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{feature.name}</span>
                      </div>
                    </th>
                    {feature.values.map((value, i) => {
                      const isHighlighted = products[i]?.highlighted ?? false;
                      return (
                        <td
                          key={i}
                          className={cn(
                            "p-4 relative text-center align-middle",
                            isHighlighted && "bg-primary/5"
                          )}
                        >
                          {isHighlighted && (
                            <div className="absolute top-0 left-0 right-0 border-2 border-primary pointer-events-none z-10 border-t-0 border-b-0 -bottom-px" />
                          )}
                          {value ? (
                            <CheckIcon
                              className={cn(
                                isHighlighted ? "text-primary" : "text-emerald-500"
                              )}
                            />
                          ) : (
                            <XIcon
                              className={cn(
                                isHighlighted
                                  ? "text-primary/50"
                                  : "text-muted-foreground"
                              )}
                            />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
