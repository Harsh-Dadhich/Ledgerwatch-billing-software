import { Circle, LayoutDashboard, LogOut, Plus, Receipt, ShoppingBag, Users } from "lucide-react";

export function Topbar({ view, setView, user, onLogout, onAddStaff }) {
  const allLinks = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
    { key: "create", label: "Create product", icon: Plus, adminOnly: true },
    { key: "products", label: "Show products", icon: ShoppingBag, adminOnly: false },
    { key: "bill", label: "Create bill", icon: Receipt, adminOnly: false },
  ];
  const links = allLinks.filter((l) => !l.adminOnly || user.role === "admin");

  return (
    <header style={{ borderBottom: "1px solid var(--line)", background: "var(--panel)" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-2.5">
          <div style={{ background: "var(--brass)" }} className="w-6 h-6 md:w-7 md:h-7 rounded-sm flex items-center justify-center shrink-0">
            <Circle size={11} strokeWidth={3} color="#14171C" />
          </div>
          <span className="disp text-[15px] md:text-[17px] font-semibold tracking-tight">Ledgerwatch</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="navlink flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13.5px] font-medium"
              style={{
                color: view === key ? "#14171C" : "var(--muted)",
                background: view === key ? "var(--brass)" : "transparent",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          {user.role === "admin" && (
            <button
              onClick={onAddStaff}
              className="flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-md text-[13px] font-medium"
              style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
              title="Add staff"
            >
              <Users size={14} />
              <span className="hidden lg:inline">Add staff</span>
            </button>
          )}
          <span className="mono text-[11px] hidden lg:inline" style={{ color: "var(--muted)" }}>
            {user.name} · {user.role}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-md text-[13px] font-medium"
            style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}
