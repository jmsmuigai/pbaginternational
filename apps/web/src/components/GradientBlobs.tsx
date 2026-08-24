export function GradientBlobs({ variant = "default" }: { variant?: "default" | "warm" }) {
  const palette =
    variant === "warm"
      ? ["bg-coral", "bg-gold", "bg-primary"]
      : ["bg-primary", "bg-coral", "bg-emerald"];
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className={`blob ${palette[0]} w-96 h-96 -top-20 -left-20 animate-blob`} />
      <div className={`blob ${palette[1]} w-80 h-80 top-1/3 right-0 animate-blob`} style={{ animationDelay: "2s" }} />
      <div className={`blob ${palette[2]} w-72 h-72 bottom-0 left-1/4 animate-blob`} style={{ animationDelay: "4s" }} />
    </div>
  );
}
