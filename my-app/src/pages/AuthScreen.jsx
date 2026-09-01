import { useState } from "react";
import { Check, Circle, Loader2 } from "lucide-react";
import { Field } from "../components/common/Field";
import { authApi } from "../api/auth";

export function AuthScreen({ onAuthed }) {
  const [mode, setMode] = useState("login"); // login | signup | forgot
  const [form, setForm] = useState({ storeName: "", name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "forgot") {
        await authApi.forgotPassword({ email: form.email });
        setForgotSent(true);
        return;
      }
      const user =
        mode === "login"
          ? await authApi.login({ email: form.email, password: form.password })
          : await authApi.signup({
              store_name: form.storeName,
              name: form.name,
              email: form.email,
              password: form.password,
            });
      onAuthed(user);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function switchMode(next) {
    setMode(next);
    setError("");
    setForgotSent(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[420px]">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div style={{ background: "var(--brass)" }} className="w-7 h-7 rounded-sm flex items-center justify-center">
            <Circle size={12} strokeWidth={3} color="#14171C" />
          </div>
          <span className="disp text-[19px] font-semibold tracking-tight">Ledgerwatch</span>
        </div>

        <div className="rounded-lg p-6" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          {mode !== "forgot" && (
            <div className="flex gap-2 mb-6">
              {[{ k: "login", l: "Log in" }, { k: "signup", l: "Create your store" }].map(({ k, l }) => (
                <button
                  key={k}
                  onClick={() => switchMode(k)}
                  className="flex-1 py-2 rounded-md text-[13.5px] font-medium"
                  style={{
                    background: mode === k ? "var(--brass)" : "transparent",
                    color: mode === k ? "#14171C" : "var(--muted)",
                    border: "1px solid " + (mode === k ? "var(--brass)" : "var(--line)"),
                  }}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          {mode === "forgot" && forgotSent ? (
            <div className="py-4 text-center flex flex-col items-center gap-3">
              <div style={{ background: "var(--teal)" }} className="w-10 h-10 rounded-full flex items-center justify-center">
                <Check size={20} color="#14171C" />
              </div>
              <div className="disp text-[15px] font-semibold">Check your email</div>
              <p className="text-[13px]" style={{ color: "var(--muted)" }}>
                If that email is registered, we've sent a link to reset the password. It expires in 30 minutes.
              </p>
              <button onClick={() => switchMode("login")} className="text-[13px] font-medium mt-1" style={{ color: "var(--brass)" }}>
                Back to log in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              {mode === "forgot" && (
                <p className="text-[13px] mb-1" style={{ color: "var(--muted)" }}>
                  Enter your account email and we'll send a reset link.
                </p>
              )}
              {mode === "signup" && (
                <Field label="Store name">
                  <input
                    required value={form.storeName}
                    onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                    className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
                    style={{ border: "1px solid var(--line)" }}
                  />
                </Field>
              )}
              {mode === "signup" && (
                <Field label="Your name">
                  <input
                    required value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
                    style={{ border: "1px solid var(--line)" }}
                  />
                </Field>
              )}
              <Field label="Email">
                <input
                  required type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
                  style={{ border: "1px solid var(--line)" }}
                />
              </Field>
              {mode !== "forgot" && (
                <Field label="Password">
                  <input
                    required type="password" minLength={8} value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
                    style={{ border: "1px solid var(--line)" }}
                  />
                </Field>
              )}

              {mode === "login" && (
                <button type="button" onClick={() => switchMode("forgot")} className="text-[12.5px] text-left" style={{ color: "var(--brass)" }}>
                  Forgot password?
                </button>
              )}
              {mode === "forgot" && (
                <button type="button" onClick={() => switchMode("login")} className="text-[12.5px] text-left" style={{ color: "var(--muted)" }}>
                  Back to log in
                </button>
              )}

              {error && (
                <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp"
                style={{ background: "var(--brass)", color: "#14171C", opacity: loading ? 0.7 : 1 }}
              >
                {loading && <Loader2 size={15} className="spin" />}
                {mode === "login" && "Log in"}
                {mode === "signup" && "Create store & admin account"}
                {mode === "forgot" && "Send reset link"}
              </button>
            </form>
          )}
        </div>

        {mode === "signup" && (
          <p className="text-[12px] text-center mt-4" style={{ color: "var(--muted)" }}>
            This creates you as the store admin. Add sales-staff accounts from inside the dashboard afterward.
          </p>
        )}
      </div>
    </div>
  );
}
