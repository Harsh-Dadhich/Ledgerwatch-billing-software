import { useState } from "react";
import { Check } from "lucide-react";
import { Field } from "../common/Field";
import { authApi } from "../../api/auth";

export function AddStaffForm({ onBack, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authApi.createStaff(form);
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Could not create staff account");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="py-6 text-center flex flex-col items-center gap-2">
        <div style={{ background: "var(--teal)" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-1">
          <Check size={20} color="#14171C" />
        </div>
        <div className="disp text-[16px] font-semibold">Staff account created</div>
        <div className="text-[13px]" style={{ color: "var(--muted)" }}>{form.email} can now log in.</div>
        <button onClick={onCreated} className="mt-2 px-4 py-2 rounded-md text-[13.5px] font-medium" style={{ background: "var(--brass)", color: "#14171C" }}>
          Done
        </button>
      </div>
    );
  }

  return (
    <>
      <button onClick={onBack} className="text-[12.5px] mb-4" style={{ color: "var(--muted)" }}>
        ← Back to staff list
      </button>
      <h2 className="disp text-[18px] font-semibold mb-1">Add sales staff</h2>
      <p className="text-[13px] mb-5" style={{ color: "var(--muted)" }}>Creates a login for your store, scoped to sales access.</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <Field label="Name">
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)" }} />
        </Field>
        <Field label="Email">
          <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)" }} />
        </Field>
        <Field label="Temporary password">
          <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)" }} />
        </Field>
        {error && (
          <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
            {error}
          </div>
        )}
        <button type="submit" disabled={loading} className="mt-2 rounded-md py-2.5 text-[14px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
          {loading ? "Creating…" : "Create staff account"}
        </button>
      </form>
    </>
  );
}
