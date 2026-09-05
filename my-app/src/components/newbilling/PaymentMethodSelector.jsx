import { Banknote, Clock, Smartphone } from "lucide-react";

const METHODS = [
  { key: "cash", label: "Cash", icon: Banknote },
  { key: "online", label: "Online", icon: Smartphone },
  { key: "due", label: "Due", icon: Clock },
];

export function PaymentMethodSelector({ value, onChange }) {
  return (
    <div className="rounded-lg p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
      <div className="text-[12px] mb-3" style={{ color: "var(--muted)" }}>Payment method</div>
      <div className="grid grid-cols-3 gap-2">
        {METHODS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-md text-[12.5px] font-medium"
            style={{
              background: value === key ? "var(--brass)" : "transparent",
              color: value === key ? "#14171C" : "var(--muted)",
              border: "1px solid " + (value === key ? "var(--brass)" : "var(--line)"),
            }}
          >
            <Icon size={17} />
            {label}
          </button>
        ))}
      </div>
      {value === "due" && (
        <div className="mt-3 text-[11.5px] px-3 py-2 rounded-md" style={{ background: "rgba(201,150,62,0.12)", color: "var(--brass)" }}>
          This amount will be added to the customer's due balance.
        </div>
      )}
    </div>
  );
}
