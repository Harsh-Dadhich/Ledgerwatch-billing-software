import { useState } from "react";
import { Topbar } from "./components/layout/Topbar";
import { BottomNav } from "./components/layout/BottomNav";
import { Footer } from "./components/layout/Footer";
import { StaffModal } from "./components/staff/StaffModal";
import { Dashboard } from "./pages/Dashboard";
import { CreateProduct } from "./pages/CreateProduct";
import { Products } from "./pages/Products";
import { CreateBill } from "./pages/CreateBill";
import { NewBilling } from "./pages/NewBilling";
import { InventoryHub } from "./pages/inventory/InventoryHub";
import { useDraftBill } from "./hooks/useDraftBill";

export function Console({ user, onLogout }) {
  const [view, setView] = useState(user.role === "admin" ? "dashboard" : "bill");
  const [showStaffModal, setShowStaffModal] = useState(false);

  // The in-progress bill lives here, not inside CreateBill, so switching
  // to another tab (Dashboard, Products) and back doesn't unmount
  // CreateBill and lose whatever the salesperson had already added.
  const { lineItems, setLineItems, billDiscount, setBillDiscount, clearDraft } = useDraftBill();

  const isAdminView = view === "dashboard" || view === "create" || view === "inventory";
  const canSeeView = user.role === "admin" || !isAdminView;

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar view={view} setView={setView} user={user} onLogout={onLogout} onAddStaff={() => setShowStaffModal(true)} />
      <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 pb-24 md:pb-8 max-w-[1200px] w-full mx-auto">
        {!canSeeView && (
          <div className="rounded-lg p-6 text-center" style={{ border: "1px dashed var(--line)", color: "var(--muted)" }}>
            You don't have access to this page. Ask an admin if you need it.
          </div>
        )}
        {canSeeView && view === "dashboard" && <Dashboard canVoid={user.role === "admin"} />}
        {canSeeView && view === "create" && <CreateProduct onCreated={() => setView("products")} />}
        {view === "products" && <Products canEdit={user.role === "admin"} />}
        {view === "bill" && (
          <CreateBill
            lineItems={lineItems}
            setLineItems={setLineItems}
            billDiscount={billDiscount}
            setBillDiscount={setBillDiscount}
            clearDraft={clearDraft}
          />
        )}
        {view === "newBilling" && <NewBilling />}
        {canSeeView && view === "inventory" && <InventoryHub />}
      </main>
      <Footer />
      <BottomNav view={view} setView={setView} user={user} />
      {showStaffModal && <StaffModal onClose={() => setShowStaffModal(false)} />}
    </div>
  );
}
