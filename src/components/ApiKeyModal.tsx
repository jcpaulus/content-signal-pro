import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useApp } from "@/context/AppContext";
import { Lock, ExternalLink } from "lucide-react";

export function ApiKeyModal() {
  const { keyModalOpen, setKeyModalOpen, apiKey, setApiKey } = useApp();
  const [draft, setDraft] = useState(apiKey);

  useEffect(() => {
    if (keyModalOpen) setDraft(apiKey);
  }, [keyModalOpen, apiKey]);

  const isValid = draft.trim().length > 0;

  return (
    <Dialog open={keyModalOpen} onOpenChange={setKeyModalOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <DialogTitle className="text-center">Enter your Anthropic API key</DialogTitle>
          <DialogDescription className="text-center">
            Your key is stored in memory only — it's never saved, logged, or sent anywhere
            except directly to Anthropic.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <Input
            type="password"
            placeholder="sk-ant-..."
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <Button
            className="w-full"
            disabled={!isValid}
            onClick={() => {
              setApiKey(draft.trim());
              setKeyModalOpen(false);
            }}
          >
            Save key
          </Button>
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-primary"
          >
            Get a key from Anthropic <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
