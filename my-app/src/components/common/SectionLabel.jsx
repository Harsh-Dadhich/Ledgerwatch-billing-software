export function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="disp text-[13px] font-semibold tracking-wide" style={{ color: "var(--muted)" }}>
        {String(children).toUpperCase()}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
    </div>
  );
}
