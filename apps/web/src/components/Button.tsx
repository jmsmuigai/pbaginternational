import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";

// Each variant keeps a tactile, pressable 3D bevel (a solid "drop" shadow
// that flattens on hover/active, like a real button being pushed) but built
// from PBAG's own brand tokens (packages/shared/src/constants.ts + the
// Tailwind color tokens above) instead of Tailwind's stock purple/slate/
// amber palette, which clashed with the rest of the earthy red/gold/black
// Kikuyu-cinema theme used everywhere else on the site.
const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-primary to-primary-dark text-cream border border-primary-light/50 shadow-[0_4px_0_rgb(130,38,23),0_5px_18px_rgba(179,57,36,0.45)] hover:shadow-[0_2px_0_rgb(130,38,23),0_4px_14px_rgba(179,57,36,0.5)] hover:translate-y-[2px]",
  secondary:
    "bg-gradient-to-b from-surfaceAlt to-surface text-cream border border-white/10 shadow-[0_4px_0_rgba(13,13,13,0.6),0_5px_15px_rgba(0,0,0,0.35)] hover:shadow-[0_2px_0_rgba(13,13,13,0.6),0_4px_10px_rgba(0,0,0,0.35)] hover:translate-y-[2px]",
  ghost:
    "bg-transparent text-cream border border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.15)]",
  gold: "bg-gradient-to-b from-gold to-coral text-ink font-bold border border-gold/60 shadow-[0_4px_0_rgb(130,38,23),0_5px_18px_rgba(212,175,55,0.45)] hover:shadow-[0_2px_0_rgb(130,38,23),0_4px_14px_rgba(212,175,55,0.5)] hover:translate-y-[2px]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-sm md:text-base transition-all duration-150 active:translate-y-[4px] active:shadow-none";

export function Button({
  children,
  variant = "primary",
  href,
  className = "",
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
