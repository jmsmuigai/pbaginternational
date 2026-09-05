import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "gold";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-b from-purple-500 to-indigo-600 text-white shadow-[0_4px_0_rgb(67,56,202),0_5px_15px_rgba(124,58,237,0.5)] border border-purple-400 hover:shadow-[0_2px_0_rgb(67,56,202),0_4px_10px_rgba(124,58,237,0.5)] hover:translate-y-[2px]",
  secondary: "bg-gradient-to-b from-slate-700 to-slate-800 text-white border border-slate-500 shadow-[0_4px_0_rgb(51,65,85),0_5px_15px_rgba(0,0,0,0.3)] hover:shadow-[0_2px_0_rgb(51,65,85),0_4px_10px_rgba(0,0,0,0.3)] hover:translate-y-[2px]",
  ghost: "bg-transparent text-cream border border-white/20 hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]",
  gold: "bg-gradient-to-b from-yellow-400 to-amber-500 text-black font-bold border border-yellow-300 shadow-[0_4px_0_rgb(180,83,9),0_5px_15px_rgba(245,158,11,0.5)] hover:shadow-[0_2px_0_rgb(180,83,9),0_4px_10px_rgba(245,158,11,0.5)] hover:translate-y-[2px]",
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 font-semibold text-sm md:text-base transition-all duration-150 active:translate-y-[4px] active:shadow-[0_0_0_rgb(67,56,202),0_0_0_rgba(0,0,0,0)]";

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
