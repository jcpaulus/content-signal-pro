import { useEffect, useState } from "react";

interface Props {
  score: number; // 0-100
}

function colorClass(score: number) {
  if (score >= 75) return "text-success";
  if (score >= 50) return "text-warning";
  return "text-danger";
}
function strokeColor(score: number) {
  if (score >= 75) return "var(--color-success)";
  if (score >= 50) return "var(--color-warning)";
  return "var(--color-danger)";
}

export function ScoreCircle({ score }: Props) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    let frame = 0;
    const total = 40;
    const tick = () => {
      frame++;
      setAnimated(Math.min(score, Math.round((score * frame) / total)));
      if (frame < total) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [score]);

  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div className="relative flex h-56 w-56 items-center justify-center">
      <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth="14"
        />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={strokeColor(score)}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s ease-out" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <div className={`text-6xl font-bold tabular-nums ${colorClass(score)}`}>{animated}</div>
        <div className="text-sm text-muted-foreground">out of 100</div>
      </div>
    </div>
  );
}
