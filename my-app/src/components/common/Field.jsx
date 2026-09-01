export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px]" style={{ color: "var(--muted)" }}>{label}</span>
      {children}
    </label>
  );
}
