import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-medium tracking-wide transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-primary/25 bg-primary/10 text-primary",
        secondary:
          "border-white/10 bg-white/[0.04] text-muted-foreground",
        success:
          "border-emerald-500/25 bg-emerald-500/10 text-emerald-400",
        warning:
          "border-amber-500/25 bg-amber-500/10 text-amber-400",
        destructive:
          "border-red-500/25 bg-red-500/10 text-red-400",
        gold:
          "border-[#c9a227]/30 bg-[#c9a227]/10 text-[#e8c547]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };