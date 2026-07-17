import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow = "SphereFlow",
  children,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-b border-white/[0.06] pb-4 sm:gap-4 sm:pb-6 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <p className="section-label">{eyebrow}</p>
        <h1 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:mt-2">
            {description}
          </p>
        )}
      </div>
      {children && (
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:gap-3">
          {children}
        </div>
      )}
    </div>
  );
}