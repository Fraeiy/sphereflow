import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  showWordmark?: boolean;
}

const sizes = {
  sm: { icon: "h-7 w-7", text: "text-sm" },
  md: { icon: "h-9 w-9", text: "text-base" },
  lg: { icon: "h-11 w-11", text: "text-lg" },
};

export function Logo({ className, size = "md", showWordmark = true }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-zinc-800 to-zinc-950 shadow-lg",
          s.icon
        )}
        style={{
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.08) inset, 0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <svg
          viewBox="0 0 32 32"
          className="h-[55%] w-[55%]"
          fill="none"
          aria-hidden
        >
          <circle
            cx="16"
            cy="16"
            r="10"
            stroke="url(#logoGrad)"
            strokeWidth="1.5"
          />
          <circle cx="16" cy="16" r="4" fill="url(#logoGrad)" opacity="0.9" />
          <path
            d="M16 6v4M16 22v4M6 16h4M22 16h4"
            stroke="url(#logoGrad)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.6"
          />
          <defs>
            <linearGradient id="logoGrad" x1="8" y1="8" x2="24" y2="24">
              <stop stopColor="#f5d061" />
              <stop offset="1" stopColor="#e8a317" />
            </linearGradient>
          </defs>
        </svg>
        <div className="pointer-events-none absolute inset-0 rounded-xl bg-primary/5" />
      </div>
      {showWordmark && (
        <div className="leading-none">
          <p className={cn("font-semibold tracking-tight", s.text)}>SphereFlow</p>
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Treasury
          </p>
        </div>
      )}
    </div>
  );
}