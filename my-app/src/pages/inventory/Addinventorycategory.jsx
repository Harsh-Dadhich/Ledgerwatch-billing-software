import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Field } from "../../components/common/Field";
import { categoriesApi } from "../../api/Categories";

function Input(props) {
  return (
    <input
      {...props}
      className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
      style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
    />
  );
}

export function AddInventoryCategory({ onBack }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
  });
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  const handleSave = async () => {
    try {
      await categoriesApi.create({
        name: form.name,
        description: form.description || null,
      });

      alert("Category created successfully");

      onBack();
    } catch (error) {
      console.error(error);
      alert("Failed to create category");
    }
  };

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-1.5 text-[12.5px] mb-4" style={{ color: "var(--muted)" }}>
        <ArrowLeft size={14} /> Back to categories
      </button>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">Add category</h1>
      <p className="text-[13.5px] mb-7" style={{ color: "var(--muted)" }}>
        Create a new product category.
      </p>

      <div className="max-w-[560px] flex flex-col gap-6">
        <div>
          <div className="mono text-[11px] mb-3" style={{ color: "var(--brass)" }}>BASIC INFORMATION</div>
          <div className="flex flex-col gap-3">
            <Field label="Category name *">
              <Input value={form.name || ""} onChange={set("name")} placeholder="e.g. Beverages" />
            </Field>
            <Field label="Description">
              <Input value={form.description || ""} onChange={set("description")} placeholder="Optional description" />
            </Field>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          className="rounded-md py-2.5 text-[14px] font-semibold disp"
          style={{ background: "var(--brass)", color: "#14171C" }}
        >
          Save category
        </button>
      </div>
    </div>
  );
}