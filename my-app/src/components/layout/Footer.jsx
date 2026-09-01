export function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)" }} className="py-5 text-center">
      <span className="mono text-[11px]" style={{ color: "var(--muted)" }}>
        LEDGERWATCH · {new Date().getFullYear()}
      </span>
    </footer>
  );
}
