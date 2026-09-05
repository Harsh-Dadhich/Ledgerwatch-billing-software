import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Field } from "../../components/common/Field";

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full rounded-md px-3 py-2.5 text-[14px]"
      style={{ border: "1px solid var(--line)", background: "var(--panel)", color: "var(--ivory)" }}
    >
      {children}
    </select>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
      style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
    />
  );
}

export function AddInventoryProduct({ onBack }) {
  const [form, setForm] = useState({});
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12.5px] mb-4" style={{ color: "var(--muted)" }}>
        <ArrowLeft size={14} /> Back to products
      </button>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">Add product</h1>
      <p className="text-[13.5px] mb-7" style={{ color: "var(--muted)" }}>
        UI preview only — this will save to the catalogue once the inventory backend is connected.
      </p>

      <div className="max-w-[560px] flex flex-col gap-6">
        <div>
          <div className="mono text-[11px] mb-3" style={{ color: "var(--brass)" }}>BASIC INFORMATION</div>
          <div className="flex flex-col gap-3">
            <Field label="Product name *"><Input value={form.name || ""} onChange={set("name")} placeholder="e.g. Coca Cola 750ml" /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="SKU"><Input value={form.sku || ""} onChange={set("sku")} placeholder="CC750" /></Field>
              <Field label="Barcode"><Input value={form.barcode || ""} onChange={set("barcode")} placeholder="890123456789" /></Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Brand">
                <Select value={form.brand || ""} onChange={set("brand")}>
                  <option value="">Select brand</option>
                  <option>Coca Cola</option><option>Pepsi</option><option>Amul</option><option>Parle</option>
                </Select>
              </Field>
              <Field label="Category">
                <Select value={form.category || ""} onChange={set("category")}>
                  <option value="">Select category</option>
                  <option>Beverages</option><option>Snacks</option><option>Dairy</option><option>Grocery</option>
                </Select>
              </Field>
            </div>
            <Field label="Sub category">
              <Select value={form.subCategory || ""} onChange={set("subCategory")}>
                <option value="">Select sub category</option>
                <option>Soft Drinks</option>
              </Select>
            </Field>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] mb-3" style={{ color: "var(--brass)" }}>PRICING</div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Purchase price"><Input type="number" value={form.purchasePrice || ""} onChange={set("purchasePrice")} placeholder="30" /></Field>
            <Field label="Selling price *"><Input type="number" value={form.sellingPrice || ""} onChange={set("sellingPrice")} placeholder="40" /></Field>
            <Field label="MRP"><Input type="number" value={form.mrp || ""} onChange={set("mrp")} placeholder="45" /></Field>
            <Field label="GST">
              <Select value={form.gst || ""} onChange={set("gst")}>
                <option value="">Select GST</option>
                <option>0%</option><option>5%</option><option>12%</option><option>18%</option><option>28%</option>
              </Select>
            </Field>
          </div>
        </div>

        <div>
          <div className="mono text-[11px] mb-3" style={{ color: "var(--brass)" }}>INVENTORY</div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Opening stock"><Input type="number" value={form.openingStock || ""} onChange={set("openingStock")} placeholder="100" /></Field>
            <Field label="Minimum stock alert"><Input type="number" value={form.minStock || ""} onChange={set("minStock")} placeholder="20" /></Field>
            <Field label="Unit">
              <Select value={form.unit || ""} onChange={set("unit")}>
                <option value="">Select unit</option>
                <option>Pcs</option><option>Kg</option><option>Litre</option><option>Box</option>
              </Select>
            </Field>
          </div>
        </div>

        <button
          type="button"
          className="rounded-md py-2.5 text-[14px] font-semibold disp"
          style={{ background: "var(--brass)", color: "#14171C" }}
        >
          Save product
        </button>
      </div>
    </div>
  );
}
