import { useState } from "react";
import { InventorySubNav } from "../../components/inventory/InventorySubNav";
import { InventoryDashboard } from "./InventoryDashboard";
import { InventoryProductList } from "./InventoryProductList";
import { AddInventoryProduct } from "./AddInventoryProduct";
import { InventoryProductDetail } from "./InventoryProductDetail";
import { InventoryCategories } from "./InventoryCategories";
import { InventoryBrands } from "./InventoryBrands";
import { InventoryStockHistory } from "./InventoryStockHistory";
import { InventoryLowStock } from "./InventoryLowStock";
import { InventoryBulkImport } from "./InventoryBulkImport";
import { InventoryBulkEdit } from "./InventoryBulkEdit";

export function InventoryHub() {
  // "tab" drives the visible sub-nav. "drill" is a stack-free single-level
  // drill-down (add product / product detail) reached from the Products
  // tab -- leaving drill clears back to the underlying tab's list view.
  const [tab, setTab] = useState("dashboard");
  const [drill, setDrill] = useState(null); // null | "add" | "detail"

  function changeTab(next) {
    setTab(next);
    setDrill(null);
  }

  if (drill === "add") {
    return (
      <div>
        <InventorySubNav active={tab} onChange={changeTab} />
        <AddInventoryProduct onBack={() => setDrill(null)} />
      </div>
    );
  }

  if (drill === "detail") {
    return (
      <div>
        <InventorySubNav active={tab} onChange={changeTab} />
        <InventoryProductDetail onBack={() => setDrill(null)} onViewHistory={() => changeTab("history")} />
      </div>
    );
  }

  return (
    <div>
      <InventorySubNav active={tab} onChange={changeTab} />
      {tab === "dashboard" && <InventoryDashboard onViewLowStock={() => changeTab("lowstock")} />}
      {tab === "products" && (
        <InventoryProductList
          onAddProduct={() => setDrill("add")}
          onOpenProduct={() => setDrill("detail")}
          onImport={() => changeTab("import")}
          onBulkEdit={() => changeTab("bulkedit")}
        />
      )}
      {tab === "categories" && <InventoryCategories />}
      {tab === "brands" && <InventoryBrands />}
      {tab === "history" && <InventoryStockHistory />}
      {tab === "lowstock" && <InventoryLowStock />}
      {tab === "import" && <InventoryBulkImport />}
      {tab === "bulkedit" && <InventoryBulkEdit />}
    </div>
  );
}
