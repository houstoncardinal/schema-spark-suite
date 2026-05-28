import { Link } from "react-router-dom";

interface LogoProps {
  variant?: "default" | "light" | "compact";
  className?: string;
  to?: string;
}

/**
 * Enterprise text logo for SEO Cloud Labs.
 * - Custom monogram mark + wordmark
 * - Scales cleanly on all devices
 * - Uses semantic theme tokens (no hard-coded colors)
 */
export function Logo({ variant = "default", className = "", to = "/" }: LogoProps) {
  const isCompact = variant === "compact";
  const isLight = variant === "light";

  return (
    <Link to={to} aria-label="SEO Cloud Labs — home" className={`group inline-flex items-center gap-2.5 ${className}`}>
      {/* Monogram mark */}
      <span
        className="relative inline-flex items-center justify-center rounded-[10px] h-8 w-8 shrink-0 overflow-hidden transition-transform duration-300 group-hover:scale-105"
        style={{
          backgroundImage: "var(--gradient-rainbow)",
          backgroundSize: "200% auto",
          animation: "gradient-shift 6s linear infinite",
          boxShadow: "0 1px 2px hsl(var(--accent) / 0.25), 0 6px 20px hsl(var(--accent) / 0.18)",
        }}
      >
        <span className="absolute inset-[1.5px] rounded-[8px] bg-background/95 backdrop-blur-sm" />
        <span
          className="relative text-[13px] font-black tracking-tight bg-clip-text text-transparent leading-none"
          style={{ backgroundImage: "var(--gradient-rainbow)", backgroundSize: "200% auto", animation: "gradient-shift 6s linear infinite" }}
        >
          S<span className="text-[9px] align-top">.</span>C
        </span>
      </span>

      {/* Wordmark */}
      {!isCompact && (
        <span className="flex flex-col leading-none">
          <span
            className={`text-[15px] sm:text-[16px] font-bold tracking-[-0.02em] ${
              isLight ? "text-gray-900" : "text-foreground"
            }`}
          >
            SEO<span className="font-serif italic font-normal mx-0.5 bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-rainbow)" }}>Cloud</span>Labs
          </span>
          <span className={`text-[9px] font-medium uppercase tracking-[0.18em] mt-1 ${isLight ? "text-gray-500" : "text-muted-foreground"}`}>
            Intelligence Suite
          </span>
        </span>
      )}
    </Link>
  );
}
