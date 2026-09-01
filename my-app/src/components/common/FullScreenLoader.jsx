import { Loader2 } from "lucide-react";

export function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={28} className="spin" style={{ color: "var(--brass)" }} />
    </div>
  );
}
