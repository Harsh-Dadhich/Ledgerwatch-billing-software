export function StatCard({ label, value, icon: Icon, isText }) {
  return (
    <div className="card-hover rounded-lg p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px]" style={{ color: "var(--muted)" }}>{label}</span>
        <Icon size={15} style={{ color: "var(--brass)" }} />
      </div>
      <div className={isText ? "disp text-[16px] font-semibold" : "mono text-[24px] font-semibold tabular-nums"}>
        {value}
      </div>
    </div>
  );
}
