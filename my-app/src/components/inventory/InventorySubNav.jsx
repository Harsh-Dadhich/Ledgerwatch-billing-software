export function InventorySubNav({ active, onChange }) {
  const tabs = [
    { key: "dashboard", label: "Dashboard" },
    { key: "products", label: "Products" },
    { key: "categories", label: "Categories" },
    { key: "brands", label: "Brands" },
    { key: "history", label: "Stock History" },
    { key: "lowstock", label: "Low Stock" },
    { key: "import", label: "Import" },
    { key: "bulkedit", label: "Bulk Edit" },
  ];

  return (
    <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1" style={{ borderBottom: "1px solid var(--line)" }}>
      {tabs.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="navlink px-3 py-2 rounded-t-md text-[13px] font-medium whitespace-nowrap shrink-0"
          style={{
            color: active === key ? "var(--brass)" : "var(--muted)",
            borderBottom: active === key ? "2px solid var(--brass)" : "2px solid transparent",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
