import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-gradient text-cream shadow-glow hover:shadow-[0_0_55px_rgba(124,58,237,0.55)] hover:-translate-y-0.5",
  secondary: "bg-surfaceAlt text-cream border border-white/10 hover:border-primary-light/60 hover:-translate-y-0.5",
  ghost: "bg-transparent text-cream border border-white/20 hover:bg-white/10",
  gold: "bg-gradient-to-r from-gold to-coral text-ink shadow-glow-gold hover:-translate-y-0.5",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-sm md:text-base transition-all duration-300 active:translate-y-0";

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
