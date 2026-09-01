import { useState } from "react";
import { Check, Circle, Loader2 } from "lucide-react";
import { Field } from "../components/common/Field";
import { authApi } from "../api/auth";

export function ResetPasswordScreen({ token, onDone }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      await authApi.resetPassword({ token, new_password: password });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
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
          {success ? (
            <div className="py-4 text-center flex flex-col items-center gap-3">
              <div style={{ background: "var(--teal)" }} className="w-10 h-10 rounded-full flex items-center justify-center">
                <Check size={20} color="#14171C" />
              </div>
              <div className="disp text-[15px] font-semibold">Password updated</div>
              <p className="text-[13px]" style={{ color: "var(--muted)" }}>You can now log in with your new password.</p>
              <button onClick={onDone} className="mt-2 px-4 py-2 rounded-md text-[13.5px] font-medium" style={{ background: "var(--brass)", color: "#14171C" }}>
                Go to log in
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <h2 className="disp text-[17px] font-semibold mb-1">Set a new password</h2>
              <Field label="New password">
                <input
                  required type="password" minLength={8} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
                  style={{ border: "1px solid var(--line)" }}
                />
              </Field>
              <Field label="Confirm new password">
                <input
                  required type="password" minLength={8} value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
                  style={{ border: "1px solid var(--line)" }}
                />
              </Field>
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
                Update password
              </button>
              <button type="button" onClick={onDone} className="text-[12.5px] text-center mt-1" style={{ color: "var(--muted)" }}>
                Cancel
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
