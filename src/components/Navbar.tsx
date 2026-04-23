import { Link } from "@tanstack/react-router";
import { Lock, LockKeyhole, Radar } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { apiKey, setKeyModalOpen } = useApp();
  return (
    <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Radar className="h-4 w-4" />
          </div>
          <span className="text-base font-semibold tracking-tight">ClearSignal</span>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setKeyModalOpen(true)}
          className="gap-2 text-muted-foreground"
          aria-label="API key settings"
        >
          {apiKey ? <LockKeyhole className="h-4 w-4 text-success" /> : <Lock className="h-4 w-4" />}
          <span className="hidden sm:inline">{apiKey ? "API key set" : "Set API key"}</span>
        </Button>
      </div>
    </header>
  );
}
