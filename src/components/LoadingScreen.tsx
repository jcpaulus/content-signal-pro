import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";

const STEPS = [
  "Reading your homepage...",
  "Analyzing content structure...",
  "Running GEO framework...",
  "Simulating buyer queries...",
  "Generating your action plan...",
];

export function LoadingScreen() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setStep((s) => (s + 1) % STEPS.length);
    }, 2200);
    const progTimer = setInterval(() => {
      setProgress((p) => (p < 92 ? p + Math.random() * 4 : p));
    }, 400);
    return () => {
      clearInterval(stepTimer);
      clearInterval(progTimer);
    };
  }, []);

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
        <Sparkles className="h-6 w-6 animate-pulse text-primary" />
      </div>
      <h2 className="text-xl font-semibold">Analyzing your site</h2>
      <p className="mt-2 min-h-[1.5rem] text-sm text-muted-foreground transition-opacity">
        {STEPS[step]}
      </p>
      <div className="mt-6 w-full">
        <Progress value={progress} />
      </div>
    </div>
  );
}
