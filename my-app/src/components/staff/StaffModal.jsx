import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { StaffRow } from "./StaffRow";
import { AddStaffForm } from "./AddStaffForm";
import { authApi } from "../../api/auth";

export function StaffModal({ onClose }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  function loadStaff() {
    setLoading(true);
    authApi.getStaff().then(setStaff).finally(() => setLoading(false));
  }

  useEffect(() => {
    loadStaff();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-[420px] max-h-[85vh] overflow-y-auto rounded-lg p-6 relative" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: "var(--muted)" }}>
          <X size={18} />
        </button>

        {showAddForm ? (
          <AddStaffForm
            onBack={() => setShowAddForm(false)}
            onCreated={() => { setShowAddForm(false); loadStaff(); }}
          />
        ) : (
          <>
            <h2 className="disp text-[18px] font-semibold mb-1">Sales staff</h2>
            <p className="text-[13px] mb-5" style={{ color: "var(--muted)" }}>Accounts scoped to sales access for your store.</p>

            {loading ? (
              <div className="py-8 flex justify-center"><Loader2 size={20} className="spin" style={{ color: "var(--brass)" }} /></div>
            ) : staff.length === 0 ? (
              <div className="rounded-lg p-6 text-center mb-4" style={{ border: "1px dashed var(--line)" }}>
                <span className="text-[13px]" style={{ color: "var(--muted)" }}>No staff accounts yet.</span>
              </div>
            ) : (
              <div className="flex flex-col gap-2 mb-4">
                {staff.map((s) => (
                  <StaffRow key={s.id} staffMember={s} onDeleted={loadStaff} onReactivated={loadStaff} />
                ))}
              </div>
            )}

            <button
              onClick={() => setShowAddForm(true)}
              className="w-full flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp"
              style={{ background: "var(--brass)", color: "#14171C" }}
            >
              <Plus size={16} />
              Add sales staff
            </button>
          </>
        )}
      </div>
    </div>
  );
}
