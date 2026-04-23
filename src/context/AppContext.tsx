import { createContext, useContext, useState, type ReactNode } from "react";
import type { AuditResult } from "@/lib/types";

interface AppContextValue {
  apiKey: string;
  setApiKey: (k: string) => void;
  result: AuditResult | null;
  setResult: (r: AuditResult | null) => void;
  competitorResult: AuditResult | null;
  setCompetitorResult: (r: AuditResult | null) => void;
  analyzedUrl: string;
  setAnalyzedUrl: (u: string) => void;
  competitorUrl: string;
  setCompetitorUrl: (u: string) => void;
  isDemo: boolean;
  setIsDemo: (b: boolean) => void;
  keyModalOpen: boolean;
  setKeyModalOpen: (b: boolean) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [apiKey, setApiKey] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [competitorResult, setCompetitorResult] = useState<AuditResult | null>(null);
  const [analyzedUrl, setAnalyzedUrl] = useState("");
  const [competitorUrl, setCompetitorUrl] = useState("");
  const [isDemo, setIsDemo] = useState(false);
  const [keyModalOpen, setKeyModalOpen] = useState(false);

  return (
    <AppContext.Provider
      value={{
        apiKey,
        setApiKey,
        result,
        setResult,
        competitorResult,
        setCompetitorResult,
        analyzedUrl,
        setAnalyzedUrl,
        competitorUrl,
        setCompetitorUrl,
        isDemo,
        setIsDemo,
        keyModalOpen,
        setKeyModalOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
