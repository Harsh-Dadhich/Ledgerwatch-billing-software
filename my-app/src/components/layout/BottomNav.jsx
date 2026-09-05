import { Boxes, LayoutDashboard, Plus, Receipt, ShoppingBag, ShoppingCart } from "lucide-react";

export function BottomNav({ view, setView, user }) {
  const allLinks = [
    { key: "dashboard", label: "Home", icon: LayoutDashboard, adminOnly: true },
    { key: "create", label: "Add", icon: Plus, adminOnly: true },
    { key: "products", label: "Products", icon: ShoppingBag, adminOnly: false },
    { key: "bill", label: "Bill", icon: Receipt, adminOnly: false },
    { key: "newBilling", label: "New Bill", icon: ShoppingCart, adminOnly: false },
    { key: "inventory", label: "Inventory", icon: Boxes, adminOnly: true },
  ];
  const links = allLinks.filter((l) => !l.adminOnly || user.role === "admin");

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
      style={{ background: "var(--panel)", borderTop: "1px solid var(--line)" }}
    >
      {links.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setView(key)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
          style={{ color: view === key ? "var(--brass)" : "var(--muted)" }}
        >
          <Icon size={19} />
          <span className="text-[10.5px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}
