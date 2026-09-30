// import { useState } from "react";
// import { InventorySubNav } from "../../components/inventory/InventorySubNav";
// import { InventoryDashboard } from "./InventoryDashboard";
// import { InventoryProductList } from "./InventoryProductList";
// import { AddInventoryProduct } from "./AddInventoryProduct";
// import { InventoryProductDetail } from "./InventoryProductDetail";
// import { InventoryCategories } from "./InventoryCategories";
// import { InventoryBrands } from "./InventoryBrands";
// import { InventoryStockHistory } from "./InventoryStockHistory";
// import { InventoryLowStock } from "./InventoryLowStock";
// import { InventoryBulkImport } from "./InventoryBulkImport";
// import { InventoryBulkEdit } from "./InventoryBulkEdit";
// import { AddInventoryCategory } from "./Addinventorycategory";
// import { AddInventoryBrand } from "./Addinventorybrand";

// export function InventoryHub() {
//   // "tab" drives the visible sub-nav. "drill" is a stack-free single-level
//   // drill-down (add product / product detail) reached from the Products
//   // tab -- leaving drill clears back to the underlying tab's list view.
//   const [tab, setTab] = useState("dashboard");
//   const [drill, setDrill] = useState(null); // null | "add" | "detail"

//   function changeTab(next) {
//     setTab(next);
//     setDrill(null);
//   }

//   if (drill === "add") {
//     return (
//       <div>
//         <InventorySubNav active={tab} onChange={changeTab} />
//         <AddInventoryProduct onBack={() => setDrill(null)} />
//       </div>
//     );
//   }

//   if (drill === "detail") {
//     return (
//       <div>
//         <InventorySubNav active={tab} onChange={changeTab} />
//         <InventoryProductDetail product={selectedProduct}onBack={() => setDrill(null)} onViewHistory={() => changeTab("history")} />
//       </div>
//     );
//   }

//   if (drill === "add-category") {
//   return (
//     <div>
//       <InventorySubNav
//         active={tab}
//         onChange={changeTab}
//       />

//       <AddInventoryCategory
//         onBack={() => setDrill(null)}
//       />
//     </div>
//   );
// }

// if (drill === "add-brand") {
//   return (
//     <div>
//       <InventorySubNav
//         active={tab}
//         onChange={changeTab}
//       />

//       <AddInventoryBrand
//         onBack={() => setDrill(null)}
//       />
//     </div>
//   );
// }

//   return (
//     <div>
//       <InventorySubNav active={tab} onChange={changeTab} />
//       {tab === "dashboard" && <InventoryDashboard onViewLowStock={() => changeTab("lowstock")} />}
//       {tab === "products" && (
//         <InventoryProductList
//           onAddProduct={() => setDrill("add")}
//           onOpenProduct={() => setDrill("detail")}
//           onImport={() => changeTab("import")}
//           onBulkEdit={() => changeTab("bulkedit")}
//         />
//       )}
//       {/* {tab === "categories" && <InventoryCategories />} */}
//       {tab === "categories" && (
//       <InventoryCategories
//         onAddCategory={() => setDrill("add-category")}
//         />
//       )}
//       {/* {tab === "brands" && <InventoryBrands />} */}
//       {tab === "brands" && (
//       <InventoryBrands
//         onAddBrand={() =>setDrill("add-brand")}
//         />
//       )}
//       {tab === "history" && <InventoryStockHistory />}
//       {tab === "lowstock" && <InventoryLowStock />}
//       {tab === "import" && <InventoryBulkImport />}
//       {tab === "bulkedit" && <InventoryBulkEdit />}
//     </div>
//   );
// }

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

import { AddInventoryCategory } from "./Addinventorycategory";
import { AddInventoryBrand } from "./Addinventorybrand";

export function InventoryHub() {
  // Controls the main inventory tab
  const [tab, setTab] = useState("dashboard");

  // Controls drill-down pages
  // null | "add" | "detail" | "add-category" | "add-brand"
  const [drill, setDrill] = useState(null);

  // Currently selected product for Product Detail
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Product whose stock history should be displayed
  const [historyProductId, setHistoryProductId] = useState(null);

  function changeTab(next) {
    setTab(next);
    setDrill(null);
  }

  function openProduct(product) {
    setSelectedProduct(product);
    setDrill("detail");
  }

  function openProductHistory() {
    if (!selectedProduct?.id) {
      return;
    }

    setHistoryProductId(selectedProduct.id);
    setDrill(null);
    setTab("history");
  }

  /*
   * ADD PRODUCT
   */
  if (drill === "add") {
    return (
      <div>
        <InventorySubNav
          active={tab}
          onChange={changeTab}
        />

        <AddInventoryProduct
          onBack={() => setDrill(null)}
        />
      </div>
    );
  }

  /*
   * PRODUCT DETAIL
   */
  if (drill === "detail") {
    return (
      <div>
        <InventorySubNav
          active={tab}
          onChange={changeTab}
        />

        <InventoryProductDetail
          product={selectedProduct}
          onBack={() => {
            setDrill(null);
          }}
          onViewHistory={openProductHistory}
        />
      </div>
    );
  }

  /*
   * ADD CATEGORY
   */
  if (drill === "add-category") {
    return (
      <div>
        <InventorySubNav
          active={tab}
          onChange={changeTab}
        />

        <AddInventoryCategory
          onBack={() => setDrill(null)}
        />
      </div>
    );
  }

  /*
   * ADD BRAND
   */
  if (drill === "add-brand") {
    return (
      <div>
        <InventorySubNav
          active={tab}
          onChange={changeTab}
        />

        <AddInventoryBrand
          onBack={() => setDrill(null)}
        />
      </div>
    );
  }

  /*
   * NORMAL INVENTORY TABS
   */
  return (
    <div>
      <InventorySubNav
        active={tab}
        onChange={changeTab}
      />

      {tab === "dashboard" && (
        <InventoryDashboard
          onViewLowStock={() => changeTab("lowstock")}
        />
      )}

      {tab === "products" && (
        <InventoryProductList
          onAddProduct={() => setDrill("add")}

          onOpenProduct={openProduct}

          onImport={() => changeTab("import")}

          onBulkEdit={() => changeTab("bulkedit")}
        />
      )}

      {tab === "categories" && (
        <InventoryCategories
          onAddCategory={() => setDrill("add-category")}
        />
      )}

      {tab === "brands" && (
        <InventoryBrands
          onAddBrand={() => setDrill("add-brand")}
        />
      )}

      {tab === "history" && (
        <InventoryStockHistory 
          initialProductId={historyProductId}
        />
      )}

      {tab === "lowstock" && (
        <InventoryLowStock />
      )}

      {tab === "import" && (
        <InventoryBulkImport />
      )}

      {tab === "bulkedit" && (
        <InventoryBulkEdit />
      )}
    </div>
  );
}
