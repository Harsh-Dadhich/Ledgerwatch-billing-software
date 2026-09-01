import { useState } from "react";
import { X } from "lucide-react";
import { authApi } from "../../api/auth";

export function StaffRow({ staffMember, onDeleted, onReactivated }) {
  const [confirming, setConfirming] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  async function handleDeactivate() {
    setWorking(true);
    setError("");
    try {
      await authApi.deleteStaff(staffMember.id);
      onDeleted();
    } catch (err) {
      setError(err.message || "Could not deactivate this account");
      setWorking(false);
      setConfirming(false);
    }
  }

  async function handleReactivate() {
    setWorking(true);
    setError("");
    try {
      await authApi.reactivateStaff(staffMember.id);
      onReactivated();
    } catch (err) {
      setError(err.message || "Could not reactivate this account");
      setWorking(false);
    }
  }

  return (
    <div className="rounded-md px-3 py-2.5" style={{ border: "1px solid var(--line)", background: "var(--panel2)", opacity: staffMember.is_active ? 1 : 0.75 }}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-2">
          <div>
            <div className="text-[13.5px] font-medium truncate">{staffMember.name}</div>
            <div className="text-[11.5px] truncate" style={{ color: "var(--muted)" }}>{staffMember.email}</div>
          </div>
          <span
            className="mono text-[9.5px] px-1.5 py-0.5 rounded shrink-0"
            style={{
              background: staffMember.is_active ? "rgba(63,167,150,0.15)" : "rgba(138,143,152,0.2)",
              color: staffMember.is_active ? "var(--teal)" : "var(--muted)",
            }}
          >
            {staffMember.is_active ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        {staffMember.is_active ? (
          !confirming ? (
            <button onClick={() => setConfirming(true)} className="px-2.5 py-1.5 rounded-md text-[11.5px] font-medium shrink-0" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
              Deactivate
            </button>
          ) : (
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={handleDeactivate} disabled={working} className="px-2.5 py-1.5 rounded-md text-[11.5px] font-medium" style={{ background: "var(--rust)", color: "var(--ivory)" }}>
                {working ? "…" : "Confirm"}
              </button>
              <button onClick={() => setConfirming(false)} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)", color: "var(--muted)" }} title="Cancel">
                <X size={14} />
              </button>
            </div>
          )
        ) : (
          <button onClick={handleReactivate} disabled={working} className="px-2.5 py-1.5 rounded-md text-[11.5px] font-medium shrink-0" style={{ background: "var(--brass)", color: "#14171C" }}>
            {working ? "…" : "Reactivate"}
          </button>
        )}
      </div>
      {error && <div className="text-[11px] mt-1.5" style={{ color: "var(--rust)" }}>{error}</div>}
    </div>
  );
}
