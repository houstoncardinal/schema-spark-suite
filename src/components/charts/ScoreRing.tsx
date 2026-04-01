import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreRingProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  animated?: boolean;
  className?: string;
}

export function ScoreRing({ score, size = 100, strokeWidth = 6, label, sublabel, animated = true, className = "" }: ScoreRingProps) {
  const [displayScore, setDisplayScore] = useState(animated ? 0 : score);
  const r = (size / 2) - strokeWidth - 2;
  const circ = 2 * Math.PI * r;

  useEffect(() => {
    if (!animated) return;
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [score, animated]);

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: "hsl(var(--success))", text: "text-success", glow: "var(--shadow-glow-success)" };
    if (s >= 60) return { stroke: "hsl(var(--warning))", text: "text-warning", glow: "var(--shadow-glow-warning)" };
    return { stroke: "hsl(var(--destructive))", text: "text-destructive", glow: "" };
  };

  const colors = getColor(score);

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="score-ring" style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={strokeWidth} className="stroke-border/50" />
          <motion.circle
            cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={strokeWidth}
            stroke={colors.stroke}
            strokeLinecap="round"
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${(score / 100) * circ} ${circ}` }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center font-display font-bold ${colors.text}`}
          style={{ fontSize: size * 0.28 }}>
          {displayScore}
        </span>
      </div>
      {label && <p className="text-xs font-semibold text-foreground mt-2">{label}</p>}
      {sublabel && <p className="text-[10px] text-muted-foreground mt-0.5">{sublabel}</p>}
    </div>
  );
}
