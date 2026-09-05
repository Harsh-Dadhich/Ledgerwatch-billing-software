import { UserPlus } from "lucide-react";

export function CustomerDetailsCard() {
  return (
    <div className="rounded-lg p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
      <div className="flex items-center gap-1.5 mb-4">
        <span className="disp text-[14px] font-semibold">Customer details</span>
        <span className="text-[12px]" style={{ color: "var(--muted)" }}>(optional)</span>
      </div>
      <div className="grid sm:grid-cols-2 gap-3 sm:items-end">
        <label className="flex flex-col gap-1.5">
          <span className="text-[12px]" style={{ color: "var(--muted)" }}>Customer name</span>
          <input
            placeholder="Walk-in Customer"
            className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
            style={{ border: "1px solid var(--line)" }}
          />
        </label>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
          <label className="flex-1 flex flex-col gap-1.5">
            <span className="text-[12px]" style={{ color: "var(--muted)" }}>Phone number</span>
            <input
              placeholder="Enter phone number"
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
              style={{ border: "1px solid var(--line)" }}
            />
          </label>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-md text-[13px] font-semibold disp whitespace-nowrap"
            style={{ background: "var(--brass)", color: "#14171C" }}
          >
            <UserPlus size={15} />
            New customer
          </button>
        </div>
      </div>
    </div>
  );
}
