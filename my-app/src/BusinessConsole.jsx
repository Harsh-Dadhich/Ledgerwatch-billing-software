// import React, { useState, useEffect, useRef } from "react";
// import {
//   Camera, TrendingUp, Package, UserPlus, Plus, LayoutDashboard,
//   ShoppingBag, Circle, ArrowUpRight, Tag, X, Check,
//   Receipt, Trash2, Minus, LogOut, Users, Loader2, Search, ChevronDown, Pencil
// } from "lucide-react";
// import { api } from "./api";

// // ---------- helpers ----------
// function useRollingNumber(target, duration = 900) {
//   const [value, setValue] = useState(0);
//   const raf = useRef(null);
//   useEffect(() => {
//     const start = performance.now();
//     function tick(now) {
//       const t = Math.min(1, (now - start) / duration);
//       const eased = 1 - Math.pow(1 - t, 3);
//       setValue(Math.round(target * eased));
//       if (t < 1) raf.current = requestAnimationFrame(tick);
//     }
//     raf.current = requestAnimationFrame(tick);
//     return () => cancelAnimationFrame(raf.current);
//   }, [target, duration]);
//   return value;
// }

// function formatINR(n) {
//   return "₹" + Number(n || 0).toLocaleString("en-IN");
// }

// function timestamp() {
//   return new Date().toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" });
// }

// const THEME_VARS = {
//   ["--bg"]: "#14171C", ["--panel"]: "#1B1F26", ["--panel2"]: "#20242C",
//   ["--brass"]: "#C9963E", ["--brass-dim"]: "#8A6B34", ["--teal"]: "#3FA796",
//   ["--rust"]: "#C1553D", ["--ivory"]: "#EDE8DE", ["--muted"]: "#8A8F98",
//   ["--line"]: "#2A2F38",
// };

// const GLOBAL_STYLE = `
//   @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
//   .console { background: var(--bg); color: var(--ivory); font-family: 'Inter', sans-serif; }
//   .disp { font-family: 'Space Grotesk', sans-serif; }
//   .mono { font-family: 'IBM Plex Mono', monospace; }
//   .scanlines {
//     background-image: repeating-linear-gradient(
//       to bottom, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px,
//       transparent 1px, transparent 3px
//     );
//   }
//   @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
//   .rec-dot { animation: blink 1.6s ease-in-out infinite; }
//   @keyframes ticker { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
//   .tick-track { animation: ticker 14s linear infinite; }
//   .navlink { transition: color .15s ease, background .15s ease; }
//   .card-hover { transition: transform .18s ease, border-color .18s ease; }
//   .card-hover:hover { transform: translateY(-2px); border-color: var(--brass); }
//   input:focus, select:focus { outline: none; border-color: var(--brass) !important; }
//   ::selection { background: var(--brass); color: #14171C; }
//   @keyframes spin { to { transform: rotate(360deg); } }
//   .spin { animation: spin 0.8s linear infinite; }

//   @media print {
//     body * { visibility: hidden; }
//     #receipt, #receipt * { visibility: visible; }
//     #receipt {
//       position: absolute; top: 0; left: 0; width: 100%;
//       background: #fff !important; color: #111 !important;
//       border: none !important;
//     }
//     .print\\:hidden { display: none !important; }
//   }
// `;

// // ---------- root: auth gate ----------
// export default function App() {
//   const [authState, setAuthState] = useState("loading"); // loading | authed | unauthed
//   const [user, setUser] = useState(null);
//   const [resetToken, setResetToken] = useState(() => new URLSearchParams(window.location.search).get("reset_token"));

//   useEffect(() => {
//     if (resetToken) return; // skip the session check while on the reset-password screen
//     api.me()
//       .then((u) => { setUser(u); setAuthState("authed"); })
//       .catch(() => setAuthState("unauthed"));
//   }, [resetToken]);

//   function clearResetToken() {
//     setResetToken(null);
//     window.history.replaceState({}, "", window.location.pathname);
//   }

//   return (
//     <div style={THEME_VARS} className="w-full min-h-screen">
//       <style>{GLOBAL_STYLE}</style>
//       <div className="console min-h-screen">
//         {resetToken && (
//           <ResetPasswordScreen token={resetToken} onDone={clearResetToken} />
//         )}
//         {!resetToken && authState === "loading" && <FullScreenLoader />}
//         {!resetToken && authState === "unauthed" && (
//           <AuthScreen onAuthed={(u) => { setUser(u); setAuthState("authed"); }} />
//         )}
//         {!resetToken && authState === "authed" && user && (
//           <Console
//             user={user}
//             onLogout={async () => {
//               await api.logout();
//               setUser(null);
//               setAuthState("unauthed");
//             }}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

// function FullScreenLoader() {
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <Loader2 size={28} className="spin" style={{ color: "var(--brass)" }} />
//     </div>
//   );
// }

// // ---------- auth screen (login / owner signup) ----------
// function AuthScreen({ onAuthed }) {
//   const [mode, setMode] = useState("login"); // login | signup | forgot
//   const [form, setForm] = useState({ storeName: "", name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [forgotSent, setForgotSent] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       if (mode === "forgot") {
//         await api.forgotPassword({ email: form.email });
//         setForgotSent(true);
//         return;
//       }
//       const user =
//         mode === "login"
//           ? await api.login({ email: form.email, password: form.password })
//           : await api.signup({
//               store_name: form.storeName,
//               name: form.name,
//               email: form.email,
//               password: form.password,
//             });
//       onAuthed(user);
//     } catch (err) {
//       setError(err.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   }

//   function switchMode(next) {
//     setMode(next);
//     setError("");
//     setForgotSent(false);
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="w-full max-w-[420px]">
//         <div className="flex items-center gap-2.5 justify-center mb-8">
//           <div style={{ background: "var(--brass)" }} className="w-7 h-7 rounded-sm flex items-center justify-center">
//             <Circle size={12} strokeWidth={3} color="#14171C" />
//           </div>
//           <span className="disp text-[19px] font-semibold tracking-tight">Ledgerwatch</span>
//         </div>

//         <div className="rounded-lg p-6" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//           {mode !== "forgot" && (
//             <div className="flex gap-2 mb-6">
//               {[{ k: "login", l: "Log in" }, { k: "signup", l: "Create your store" }].map(({ k, l }) => (
//                 <button
//                   key={k}
//                   onClick={() => switchMode(k)}
//                   className="flex-1 py-2 rounded-md text-[13.5px] font-medium"
//                   style={{
//                     background: mode === k ? "var(--brass)" : "transparent",
//                     color: mode === k ? "#14171C" : "var(--muted)",
//                     border: "1px solid " + (mode === k ? "var(--brass)" : "var(--line)"),
//                   }}
//                 >
//                   {l}
//                 </button>
//               ))}
//             </div>
//           )}

//           {mode === "forgot" && forgotSent ? (
//             <div className="py-4 text-center flex flex-col items-center gap-3">
//               <div style={{ background: "var(--teal)" }} className="w-10 h-10 rounded-full flex items-center justify-center">
//                 <Check size={20} color="#14171C" />
//               </div>
//               <div className="disp text-[15px] font-semibold">Check your email</div>
//               <p className="text-[13px]" style={{ color: "var(--muted)" }}>
//                 If that email is registered, we've sent a link to reset the password. It expires in 30 minutes.
//               </p>
//               <button onClick={() => switchMode("login")} className="text-[13px] font-medium mt-1" style={{ color: "var(--brass)" }}>
//                 Back to log in
//               </button>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//               {mode === "forgot" && (
//                 <p className="text-[13px] mb-1" style={{ color: "var(--muted)" }}>
//                   Enter your account email and we'll send a reset link.
//                 </p>
//               )}
//               {mode === "signup" && (
//                 <Field label="Store name">
//                   <input
//                     required value={form.storeName}
//                     onChange={(e) => setForm({ ...form, storeName: e.target.value })}
//                     className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
//                     style={{ border: "1px solid var(--line)" }}
//                   />
//                 </Field>
//               )}
//               {mode === "signup" && (
//                 <Field label="Your name">
//                   <input
//                     required value={form.name}
//                     onChange={(e) => setForm({ ...form, name: e.target.value })}
//                     className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
//                     style={{ border: "1px solid var(--line)" }}
//                   />
//                 </Field>
//               )}
//               <Field label="Email">
//                 <input
//                   required type="email" value={form.email}
//                   onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
//                   style={{ border: "1px solid var(--line)" }}
//                 />
//               </Field>
//               {mode !== "forgot" && (
//                 <Field label="Password">
//                   <input
//                     required type="password" minLength={8} value={form.password}
//                     onChange={(e) => setForm({ ...form, password: e.target.value })}
//                     className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
//                     style={{ border: "1px solid var(--line)" }}
//                   />
//                 </Field>
//               )}

//               {mode === "login" && (
//                 <button type="button" onClick={() => switchMode("forgot")} className="text-[12.5px] text-left" style={{ color: "var(--brass)" }}>
//                   Forgot password?
//                 </button>
//               )}
//               {mode === "forgot" && (
//                 <button type="button" onClick={() => switchMode("login")} className="text-[12.5px] text-left" style={{ color: "var(--muted)" }}>
//                   Back to log in
//                 </button>
//               )}

//               {error && (
//                 <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
//                   {error}
//                 </div>
//               )}

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="mt-2 flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp"
//                 style={{ background: "var(--brass)", color: "#14171C", opacity: loading ? 0.7 : 1 }}
//               >
//                 {loading && <Loader2 size={15} className="spin" />}
//                 {mode === "login" && "Log in"}
//                 {mode === "signup" && "Create store & admin account"}
//                 {mode === "forgot" && "Send reset link"}
//               </button>
//             </form>
//           )}
//         </div>

//         {mode === "signup" && (
//           <p className="text-[12px] text-center mt-4" style={{ color: "var(--muted)" }}>
//             This creates you as the store admin. Add sales-staff accounts from inside the dashboard afterward.
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }

// function ResetPasswordScreen({ token, onDone }) {
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     if (password.length < 8) {
//       setError("Password must be at least 8 characters.");
//       return;
//     }
//     if (password !== confirmPassword) {
//       setError("Passwords don't match.");
//       return;
//     }
//     setLoading(true);
//     try {
//       await api.resetPassword({ token, new_password: password });
//       setSuccess(true);
//     } catch (err) {
//       setError(err.message || "This reset link is invalid or has expired.");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center px-4">
//       <div className="w-full max-w-[420px]">
//         <div className="flex items-center gap-2.5 justify-center mb-8">
//           <div style={{ background: "var(--brass)" }} className="w-7 h-7 rounded-sm flex items-center justify-center">
//             <Circle size={12} strokeWidth={3} color="#14171C" />
//           </div>
//           <span className="disp text-[19px] font-semibold tracking-tight">Ledgerwatch</span>
//         </div>

//         <div className="rounded-lg p-6" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//           {success ? (
//             <div className="py-4 text-center flex flex-col items-center gap-3">
//               <div style={{ background: "var(--teal)" }} className="w-10 h-10 rounded-full flex items-center justify-center">
//                 <Check size={20} color="#14171C" />
//               </div>
//               <div className="disp text-[15px] font-semibold">Password updated</div>
//               <p className="text-[13px]" style={{ color: "var(--muted)" }}>You can now log in with your new password.</p>
//               <button onClick={onDone} className="mt-2 px-4 py-2 rounded-md text-[13.5px] font-medium" style={{ background: "var(--brass)", color: "#14171C" }}>
//                 Go to log in
//               </button>
//             </div>
//           ) : (
//             <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//               <h2 className="disp text-[17px] font-semibold mb-1">Set a new password</h2>
//               <Field label="New password">
//                 <input
//                   required type="password" minLength={8} value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
//                   style={{ border: "1px solid var(--line)" }}
//                 />
//               </Field>
//               <Field label="Confirm new password">
//                 <input
//                   required type="password" minLength={8} value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
//                   style={{ border: "1px solid var(--line)" }}
//                 />
//               </Field>
//               {error && (
//                 <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
//                   {error}
//                 </div>
//               )}
//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="mt-2 flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp"
//                 style={{ background: "var(--brass)", color: "#14171C", opacity: loading ? 0.7 : 1 }}
//               >
//                 {loading && <Loader2 size={15} className="spin" />}
//                 Update password
//               </button>
//               <button type="button" onClick={onDone} className="text-[12.5px] text-center mt-1" style={{ color: "var(--muted)" }}>
//                 Cancel
//               </button>
//             </form>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ---------- console shell ----------
// function Console({ user, onLogout }) {
//   const [view, setView] = useState(user.role === "admin" ? "dashboard" : "bill");
//   const [showStaffModal, setShowStaffModal] = useState(false);

//   const isAdminView = view === "dashboard" || view === "create";
//   const canSeeView = user.role === "admin" || !isAdminView;

//   return (
//     <div className="min-h-screen flex flex-col">
//       <Topbar view={view} setView={setView} user={user} onLogout={onLogout} onAddStaff={() => setShowStaffModal(true)} />
//       <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 pb-24 md:pb-8 max-w-[1200px] w-full mx-auto">
//         {!canSeeView && (
//           <div className="rounded-lg p-6 text-center" style={{ border: "1px dashed var(--line)", color: "var(--muted)" }}>
//             You don't have access to this page. Ask an admin if you need it.
//           </div>
//         )}
//         {canSeeView && view === "dashboard" && <Dashboard canVoid={user.role === "admin"} />}
//         {canSeeView && view === "create" && <CreateProduct onCreated={() => setView("products")} />}
//         {view === "products" && <Products canEdit={user.role === "admin"} />}
//         {view === "bill" && <CreateBill />}
//       </main>
//       <Footer />
//       <BottomNav view={view} setView={setView} user={user} />
//       {showStaffModal && <StaffModal onClose={() => setShowStaffModal(false)} />}
//     </div>
//   );
// }

// function BottomNav({ view, setView, user }) {
//   const allLinks = [
//     { key: "dashboard", label: "Home", icon: LayoutDashboard, adminOnly: true },
//     { key: "create", label: "Add", icon: Plus, adminOnly: true },
//     { key: "products", label: "Products", icon: ShoppingBag, adminOnly: false },
//     { key: "bill", label: "Bill", icon: Receipt, adminOnly: false },
//   ];
//   const links = allLinks.filter((l) => !l.adminOnly || user.role === "admin");

//   return (
//     <nav
//       className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
//       style={{ background: "var(--panel)", borderTop: "1px solid var(--line)" }}
//     >
//       {links.map(({ key, label, icon: Icon }) => (
//         <button
//           key={key}
//           onClick={() => setView(key)}
//           className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
//           style={{ color: view === key ? "var(--brass)" : "var(--muted)" }}
//         >
//           <Icon size={19} />
//           <span className="text-[10.5px] font-medium">{label}</span>
//         </button>
//       ))}
//     </nav>
//   );
// }

// function Topbar({ view, setView, user, onLogout, onAddStaff }) {
//   const allLinks = [
//     { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
//     { key: "create", label: "Create product", icon: Plus, adminOnly: true },
//     { key: "products", label: "Show products", icon: ShoppingBag, adminOnly: false },
//     { key: "bill", label: "Create bill", icon: Receipt, adminOnly: false },
//   ];
//   const links = allLinks.filter((l) => !l.adminOnly || user.role === "admin");
//   return (
//     <header style={{ borderBottom: "1px solid var(--line)", background: "var(--panel)" }}>
//       <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 h-14 md:h-16 flex items-center justify-between">
//         <div className="flex items-center gap-2 md:gap-2.5">
//           <div style={{ background: "var(--brass)" }} className="w-6 h-6 md:w-7 md:h-7 rounded-sm flex items-center justify-center shrink-0">
//             <Circle size={11} strokeWidth={3} color="#14171C" />
//           </div>
//           <span className="disp text-[15px] md:text-[17px] font-semibold tracking-tight">Ledgerwatch</span>
//         </div>

//         <nav className="hidden md:flex items-center gap-1">
//           {links.map(({ key, label, icon: Icon }) => (
//             <button
//               key={key}
//               onClick={() => setView(key)}
//               className="navlink flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13.5px] font-medium"
//               style={{
//                 color: view === key ? "#14171C" : "var(--muted)",
//                 background: view === key ? "var(--brass)" : "transparent",
//               }}
//             >
//               <Icon size={15} />
//               {label}
//             </button>
//           ))}
//         </nav>

//         <div className="flex items-center gap-1.5 md:gap-2">
//           {user.role === "admin" && (
//             <button
//               onClick={onAddStaff}
//               className="flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-md text-[13px] font-medium"
//               style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
//               title="Add staff"
//             >
//               <Users size={14} />
//               <span className="hidden lg:inline">Add staff</span>
//             </button>
//           )}
//           <span className="mono text-[11px] hidden lg:inline" style={{ color: "var(--muted)" }}>
//             {user.name} · {user.role}
//           </span>
//           <button
//             onClick={onLogout}
//             className="flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-md text-[13px] font-medium"
//             style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
//             title="Log out"
//           >
//             <LogOut size={14} />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }

// function Footer() {
//   return (
//     <footer style={{ borderTop: "1px solid var(--line)" }} className="py-5 text-center">
//       <span className="mono text-[11px]" style={{ color: "var(--muted)" }}>
//         LEDGERWATCH · {new Date().getFullYear()}
//       </span>
//     </footer>
//   );
// }

// function Field({ label, children }) {
//   return (
//     <label className="flex flex-col gap-1.5">
//       <span className="text-[12px]" style={{ color: "var(--muted)" }}>{label}</span>
//       {children}
//     </label>
//   );
// }

// // ---------- staff creation modal (admin only) ----------
// function StaffModal({ onClose }) {
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState(false);
//   const [loading, setLoading] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     setLoading(true);
//     try {
//       await api.createStaff(form);
//       setSuccess(true);
//     } catch (err) {
//       setError(err.message || "Could not create staff account");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
//       <div className="w-full max-w-[400px] rounded-lg p-6 relative" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//         <button onClick={onClose} className="absolute top-4 right-4" style={{ color: "var(--muted)" }}>
//           <X size={18} />
//         </button>

//         {success ? (
//           <div className="py-6 text-center flex flex-col items-center gap-2">
//             <div style={{ background: "var(--teal)" }} className="w-10 h-10 rounded-full flex items-center justify-center mb-1">
//               <Check size={20} color="#14171C" />
//             </div>
//             <div className="disp text-[16px] font-semibold">Staff account created</div>
//             <div className="text-[13px]" style={{ color: "var(--muted)" }}>{form.email} can now log in.</div>
//           </div>
//         ) : (
//           <>
//             <h2 className="disp text-[18px] font-semibold mb-1">Add sales staff</h2>
//             <p className="text-[13px] mb-5" style={{ color: "var(--muted)" }}>Creates a login for your store, scoped to sales access.</p>
//             <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//               <Field label="Name">
//                 <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
//                   className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)" }} />
//               </Field>
//               <Field label="Email">
//                 <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
//                   className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)" }} />
//               </Field>
//               <Field label="Temporary password">
//                 <input required type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
//                   className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)" }} />
//               </Field>
//               {error && (
//                 <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
//                   {error}
//                 </div>
//               )}
//               <button type="submit" disabled={loading} className="mt-2 rounded-md py-2.5 text-[14px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
//                 {loading ? "Creating…" : "Create staff account"}
//               </button>
//             </form>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }

// // ---------- dashboard ----------
// function groupBillsByDate(bills) {
//   const groups = {};
//   for (const bill of bills) {
//     const d = new Date(bill.created_at);
//     const key = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
//     if (!groups[key]) groups[key] = [];
//     groups[key].push(bill);
//   }
//   return groups; // insertion order == bills' order, and bills already arrive newest-first
// }

// const BILLS_PAGE_SIZE = 50;

// function Dashboard({ canVoid }) {
//   const [summary, setSummary] = useState(null);
//   const [bills, setBills] = useState([]);
//   const [selectedBill, setSelectedBill] = useState(null);
//   const [clock, setClock] = useState(timestamp());
//   const [loading, setLoading] = useState(true);
//   const [loadingMore, setLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   useEffect(() => {
//     Promise.all([api.dashboardSummary(), api.listBills(BILLS_PAGE_SIZE, 0)])
//       .then(([s, b]) => {
//         setSummary(s);
//         setBills(b);
//         setHasMore(b.length === BILLS_PAGE_SIZE);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   useEffect(() => {
//     const id = setInterval(() => setClock(timestamp()), 1000);
//     return () => clearInterval(id);
//   }, []);

//   async function loadMoreBills() {
//     setLoadingMore(true);
//     try {
//       const next = await api.listBills(BILLS_PAGE_SIZE, bills.length);
//       setBills((prev) => [...prev, ...next]);
//       setHasMore(next.length === BILLS_PAGE_SIZE);
//     } finally {
//       setLoadingMore(false);
//     }
//   }

//   const todaySales = useRollingNumber(summary?.total_sales || 0);
//   const orders = useRollingNumber(summary?.order_count || 0);

//   if (loading) return <FullScreenLoader />;

//   const grouped = groupBillsByDate(bills);
//   const dateKeys = Object.keys(grouped);

//   return (
//     <div className="flex flex-col gap-8">
//       <div>
//         <div className="mono text-[11px] mb-2" style={{ color: "var(--brass)" }}>TODAY · {clock}</div>
//         <h1 className="disp text-[28px] md:text-[34px] font-semibold tracking-tight">Today's sales</h1>
//         <div className="mono text-[46px] md:text-[58px] font-semibold leading-none mt-2 tabular-nums">
//           {formatINR(todaySales)}
//         </div>
//       </div>

//       <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//         <StatCard label="Orders today" value={orders} icon={Package} />
//         <StatCard label="Avg. ticket size" value={formatINR(summary?.avg_ticket)} icon={TrendingUp} isText />
//         <StatCard label="Camera feeds" value="2 online" icon={Camera} isText />
//       </div>

//       <div>
//         <SectionLabel>Live floor cameras</SectionLabel>
//         <div className="grid sm:grid-cols-2 gap-3 mt-2 max-w-[600px]">
//           <CameraFeed label="Front counter" seed={1} />
//           <CameraFeed label="Storeroom" seed={2} />
//         </div>
//       </div>

//       <div>
//         <SectionLabel>All bills</SectionLabel>
//         <div className="mt-2 rounded-lg overflow-hidden" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//           {bills.length === 0 ? (
//             <div className="p-8 text-center text-[13px]" style={{ color: "var(--muted)" }}>No bills yet.</div>
//           ) : (
//             dateKeys.map((dateKey) => (
//               <div key={dateKey}>
//                 <div className="px-4 py-2 mono text-[11px]" style={{ background: "var(--panel2)", color: "var(--muted)", position: "sticky", top: 0 }}>
//                   {dateKey.toUpperCase()}
//                 </div>
//                 {grouped[dateKey].map((bill) => (
//                   <button
//                     key={bill.id}
//                     onClick={() => setSelectedBill(bill)}
//                     className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left"
//                     style={{ borderBottom: "1px solid var(--line)" }}
//                   >
//                     <div>
//                       <div className="mono text-[12.5px]">{bill.bill_number}</div>
//                       <div className="text-[11.5px] mt-0.5" style={{ color: "var(--muted)" }}>
//                         {bill.salesperson_name} · {new Date(bill.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
//                       </div>
//                     </div>
//                     <span className="mono text-[14px] font-semibold" style={{ color: "var(--teal)" }}>{formatINR(bill.grand_total)}</span>
//                   </button>
//                 ))}
//               </div>
//             ))
//           )}
//           {hasMore && bills.length > 0 && (
//             <button
//               onClick={loadMoreBills}
//               disabled={loadingMore}
//               className="w-full py-3 flex items-center justify-center gap-2 text-[13px] font-medium"
//               style={{ color: "var(--brass)" }}
//             >
//               {loadingMore && <Loader2 size={14} className="spin" />}
//               {loadingMore ? "Loading…" : "Load more bills"}
//             </button>
//           )}
//         </div>
//       </div>

//       {selectedBill && (
//         <BillDetailModal
//           bill={selectedBill}
//           onClose={() => setSelectedBill(null)}
//           canVoid={canVoid}
//           onVoided={(voidedId) => {
//             setBills((prev) => prev.filter((b) => b.id !== voidedId));
//             setSelectedBill(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// function BillDetailModal({ bill, onClose, canVoid, onVoided }) {
//   const [confirmingVoid, setConfirmingVoid] = useState(false);
//   const [voiding, setVoiding] = useState(false);
//   const [voidError, setVoidError] = useState("");

//   async function handleVoid() {
//     setVoiding(true);
//     setVoidError("");
//     try {
//       await api.voidBill(bill.id);
//       onVoided(bill.id);
//     } catch (err) {
//       setVoidError(err.message || "Could not void this bill");
//       setConfirmingVoid(false);
//     } finally {
//       setVoiding(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden" style={{ background: "rgba(0,0,0,0.6)" }}>
//       <div className="w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-lg relative">
//         <div className="flex items-center justify-between gap-2 mb-2 px-1">
//           <div>
//             {canVoid && !confirmingVoid && (
//               <button onClick={() => setConfirmingVoid(true)} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--rust)", color: "var(--rust)" }}>
//                 Void bill
//               </button>
//             )}
//             {confirmingVoid && (
//               <div className="flex items-center gap-2">
//                 <span className="text-[12.5px]" style={{ color: "var(--rust)" }}>Void this bill? This can't be undone.</span>
//                 <button onClick={handleVoid} disabled={voiding} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ background: "var(--rust)", color: "var(--ivory)" }}>
//                   {voiding ? "Voiding…" : "Confirm"}
//                 </button>
//                 <button onClick={() => setConfirmingVoid(false)} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//                   Cancel
//                 </button>
//               </div>
//             )}
//           </div>
//           <div className="flex items-center gap-2">
//             <button onClick={() => window.print()} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ background: "var(--brass)", color: "#14171C" }}>
//               Print
//             </button>
//             <button onClick={onClose} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//               Close
//             </button>
//           </div>
//         </div>
//         {voidError && (
//           <div className="mb-2 text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
//             {voidError}
//           </div>
//         )}
//         <div id="receipt" className="rounded-lg p-6" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//           <div className="text-center mb-5">
//             <div className="disp text-[16px] font-semibold">Ledgerwatch</div>
//             <div className="mono text-[11px] mt-1" style={{ color: "var(--muted)" }}>{bill.bill_number}</div>
//             <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>{new Date(bill.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
//             <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>Billed by {bill.salesperson_name}</div>
//           </div>
//           <div style={{ borderTop: "1px dashed var(--line)", borderBottom: "1px dashed var(--line)" }} className="py-3 flex flex-col gap-2">
//             {bill.items.map((item, i) => (
//               <div key={i} className="flex items-center justify-between text-[13px]">
//                 <div>
//                   <div>{item.name}</div>
//                   <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>
//                     {item.quantity} × {formatINR(item.unit_price)}{item.discount_pct > 0 && ` · −${item.discount_pct}%`}
//                   </div>
//                 </div>
//                 <span className="mono">{formatINR(item.line_total)}</span>
//               </div>
//             ))}
//           </div>
//           <div className="pt-3 flex flex-col gap-1.5">
//             <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--muted)" }}>
//               <span>Subtotal</span>
//               <span className="mono">{formatINR(bill.subtotal)}</span>
//             </div>
//             {bill.bill_discount_pct > 0 && (
//               <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--rust)" }}>
//                 <span>Bill discount</span>
//                 <span className="mono">−{bill.bill_discount_pct}%</span>
//               </div>
//             )}
//             <div className="flex items-center justify-between mt-1 pt-2" style={{ borderTop: "1px solid var(--line)" }}>
//               <span className="disp text-[14px] font-semibold">Total</span>
//               <span className="mono text-[19px] font-semibold" style={{ color: "var(--brass)" }}>{formatINR(bill.grand_total)}</span>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// function SectionLabel({ children }) {
//   return (
//     <div className="flex items-center gap-2">
//       <span className="disp text-[13px] font-semibold tracking-wide" style={{ color: "var(--muted)" }}>
//         {String(children).toUpperCase()}
//       </span>
//       <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
//     </div>
//   );
// }

// function StatCard({ label, value, icon: Icon, isText }) {
//   return (
//     <div className="card-hover rounded-lg p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//       <div className="flex items-center justify-between mb-3">
//         <span className="text-[12px]" style={{ color: "var(--muted)" }}>{label}</span>
//         <Icon size={15} style={{ color: "var(--brass)" }} />
//       </div>
//       <div className={isText ? "disp text-[16px] font-semibold" : "mono text-[24px] font-semibold tabular-nums"}>
//         {value}
//       </div>
//     </div>
//   );
// }

// function CameraFeed({ label, seed }) {
//   const [clock, setClock] = useState(timestamp());
//   useEffect(() => {
//     const id = setInterval(() => setClock(timestamp()), 1000);
//     return () => clearInterval(id);
//   }, []);
//   const hue = seed === 1 ? 210 : 30;
//   return (
//     <div className="rounded-lg overflow-hidden relative" style={{ border: "1px solid var(--line)", aspectRatio: "16/10" }}>
//       <div className="scanlines absolute inset-0" style={{ background: `linear-gradient(135deg, hsl(${hue} 25% 12%), hsl(${hue} 20% 6%))` }} />
//       <div className="absolute top-2 left-2 flex items-center gap-1.5">
//         <Circle size={7} className="rec-dot" fill="#C1553D" color="#C1553D" />
//         <span className="mono text-[10px]" style={{ color: "var(--rust)" }}>REC</span>
//       </div>
//       <div className="absolute top-2 right-2">
//         <span className="mono text-[10px]" style={{ color: "rgba(237,232,222,0.6)" }}>{clock}</span>
//       </div>
//       <div className="absolute bottom-2 left-2">
//         <span className="mono text-[10.5px] px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.4)", color: "var(--ivory)" }}>{label}</span>
//       </div>
//       <div className="absolute inset-0 flex items-center justify-center opacity-20">
//         <Camera size={34} color="var(--ivory)" />
//       </div>
//     </div>
//   );
// }

// // ---------- create product ----------
// function CreateProduct({ onCreated }) {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const priceNum = Number(price) || 0;

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     if (!name || !priceNum) return;
//     setLoading(true);
//     try {
//       await api.createProduct({ name, price: priceNum });
//       onCreated();
//     } catch (err) {
//       setError(err.message || "Could not create product");
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div>
//       <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">List a new product</h1>
//       <p className="text-[13.5px] mb-7" style={{ color: "var(--muted)" }}>
//         Set the name and price per piece. Discounts are applied per-bill, not here.
//       </p>
//       <div className="grid md:grid-cols-5 gap-8">
//         <form onSubmit={handleSubmit} className="md:col-span-3 flex flex-col gap-4">
//           <Field label="Product name">
//             <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kanjivaram Silk Saree"
//               className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
//           </Field>
//           <Field label="Price per piece (₹)">
//             <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0"
//               className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
//           </Field>
//           {error && (
//             <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>{error}</div>
//           )}
//           <button type="submit" disabled={loading} className="mt-2 flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp"
//             style={{ background: "var(--brass)", color: "#14171C" }}>
//             <Plus size={16} />
//             {loading ? "Adding…" : "Add product"}
//           </button>
//         </form>
//         <div className="md:col-span-2">
//           <div className="mono text-[11px] mb-2" style={{ color: "var(--muted)" }}>LIVE PREVIEW</div>
//           <ProductCard product={{ name: name || "Untitled product", price: priceNum }} preview />
//         </div>
//       </div>
//     </div>
//   );
// }

// function ProductCard({ product, compact, preview, onEdit, onDelete }) {
//   const [confirmingDelete, setConfirmingDelete] = useState(false);

//   return (
//     <div className="card-hover rounded-lg p-4 flex flex-col gap-3 relative"
//       style={{ background: "var(--panel)", border: preview ? "1px solid var(--brass-dim)" : "1px solid var(--line)" }}>
//       {(onEdit || onDelete) && !confirmingDelete && (
//         <div className="absolute top-3 right-3 flex items-center gap-1">
//           {onEdit && (
//             <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ color: "var(--muted)" }} title="Edit product">
//               <Pencil size={14} />
//             </button>
//           )}
//           {onDelete && (
//             <button onClick={() => setConfirmingDelete(true)} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ color: "var(--muted)" }} title="Delete product">
//               <Trash2 size={14} />
//             </button>
//           )}
//         </div>
//       )}
//       {confirmingDelete && (
//         <div className="absolute top-3 right-3 flex items-center gap-1">
//           <span className="text-[11px] mr-1" style={{ color: "var(--rust)" }}>Remove?</span>
//           <button onClick={() => { onDelete(); setConfirmingDelete(false); }} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ background: "var(--rust)", color: "var(--ivory)" }} title="Confirm delete">
//             <Check size={14} />
//           </button>
//           <button onClick={() => setConfirmingDelete(false)} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)", color: "var(--muted)" }} title="Cancel">
//             <X size={14} />
//           </button>
//         </div>
//       )}
//       <div className="disp text-[15px] font-semibold leading-snug pr-6">{product.name}</div>
//       <div className="mono text-[19px] font-semibold">{formatINR(product.price)}</div>
//       {!compact && <div className="text-[12px]" style={{ color: "var(--muted)" }}>Per piece · discounts applied when billing.</div>}
//     </div>
//   );
// }

// // ---------- products view ----------
// function Products({ canEdit }) {
//   const [products, setProducts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [query, setQuery] = useState("");
//   const [editingProduct, setEditingProduct] = useState(null);

//   useEffect(() => {
//     api.listProducts().then(setProducts).finally(() => setLoading(false));
//   }, []);

//   if (loading) return <FullScreenLoader />;

//   const filtered = query.trim()
//     ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
//     : products;

//   async function handleDelete(productId) {
//     try {
//       await api.deleteProduct(productId);
//       setProducts((prev) => prev.filter((p) => p.id !== productId));
//     } catch (err) {
//       alert(err.message || "Could not delete product");
//     }
//   }

//   return (
//     <div>
//       <div className="flex items-center justify-between mb-1">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">Catalogue</h1>
//         <span className="mono text-[12px]" style={{ color: "var(--muted)" }}>
//           {query ? `${filtered.length} of ${products.length}` : `${products.length} listed`}
//         </span>
//       </div>
//       <p className="text-[13.5px] mb-4" style={{ color: "var(--muted)" }}>Everything currently live for sale.</p>

//       {products.length > 0 && (
//         <div className="relative mb-6 max-w-[360px]">
//           <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
//           <input
//             value={query}
//             onChange={(e) => setQuery(e.target.value)}
//             placeholder="Search products…"
//             className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
//             style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
//           />
//         </div>
//       )}

//       {products.length === 0 ? (
//         <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
//           <span style={{ color: "var(--muted)" }}>Nothing listed yet. Create your first product to see it here.</span>
//         </div>
//       ) : filtered.length === 0 ? (
//         <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
//           <span style={{ color: "var(--muted)" }}>No products match "{query}".</span>
//         </div>
//       ) : (
//         <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {filtered.map((p) => (
//             <ProductCard
//               key={p.id}
//               product={p}
//               onEdit={canEdit ? () => setEditingProduct(p) : undefined}
//               onDelete={canEdit ? () => handleDelete(p.id) : undefined}
//             />
//           ))}
//         </div>
//       )}

//       {editingProduct && (
//         <EditProductModal
//           product={editingProduct}
//           onClose={() => setEditingProduct(null)}
//           onSaved={(updated) => {
//             setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
//             setEditingProduct(null);
//           }}
//         />
//       )}
//     </div>
//   );
// }

// function EditProductModal({ product, onClose, onSaved }) {
//   const [name, setName] = useState(product.name);
//   const [price, setPrice] = useState(String(product.price));
//   const [error, setError] = useState("");
//   const [saving, setSaving] = useState(false);

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setError("");
//     const priceNum = Number(price);
//     if (!name.trim() || !priceNum || priceNum <= 0) {
//       setError("Enter a valid name and price.");
//       return;
//     }
//     setSaving(true);
//     try {
//       const updated = await api.updateProduct(product.id, { name: name.trim(), price: priceNum });
//       onSaved(updated);
//     } catch (err) {
//       setError(err.message || "Could not update product");
//     } finally {
//       setSaving(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
//       <div className="w-full max-w-[400px] rounded-lg p-6 relative" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//         <button onClick={onClose} className="absolute top-4 right-4" style={{ color: "var(--muted)" }}>
//           <X size={18} />
//         </button>
//         <h2 className="disp text-[18px] font-semibold mb-5">Edit product</h2>
//         <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//           <Field label="Product name">
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
//               style={{ border: "1px solid var(--line)" }}
//             />
//           </Field>
//           <Field label="Price per piece (₹)">
//             <input
//               type="number" min="0" step="0.01"
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono"
//               style={{ border: "1px solid var(--line)" }}
//             />
//           </Field>
//           {error && (
//             <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
//               {error}
//             </div>
//           )}
//           <button
//             type="submit"
//             disabled={saving}
//             className="mt-2 rounded-md py-2.5 text-[14px] font-semibold disp"
//             style={{ background: "var(--brass)", color: "#14171C" }}
//           >
//             {saving ? "Saving…" : "Save changes"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }

// // ---------- searchable product picker, for bill creation with many products ----------
// function ProductPicker({ products, selectedId, onSelect }) {
//   const [query, setQuery] = useState("");
//   const [open, setOpen] = useState(false);
//   const containerRef = useRef(null);
//   const selected = products.find((p) => p.id === selectedId);

//   useEffect(() => {
//     function handleClickOutside(e) {
//       if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const filtered = query.trim()
//     ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
//     : products;

//   return (
//     <div ref={containerRef} className="relative">
//       <button
//         type="button"
//         onClick={() => setOpen((o) => !o)}
//         className="w-full flex items-center justify-between rounded-md px-3 py-2.5 text-[14px] text-left"
//         style={{ border: "1px solid var(--line)", background: "var(--panel)", color: "var(--ivory)" }}
//       >
//         <span className="truncate">{selected ? `${selected.name} — ${formatINR(selected.price)}` : "Select a product"}</span>
//         <ChevronDown size={15} style={{ color: "var(--muted)" }} />
//       </button>

//       {open && (
//         <div className="absolute z-20 mt-1 w-full rounded-md overflow-hidden" style={{ background: "var(--panel2)", border: "1px solid var(--line)" }}>
//           <div className="p-2" style={{ borderBottom: "1px solid var(--line)" }}>
//             <div className="relative">
//               <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
//               <input
//                 autoFocus
//                 value={query}
//                 onChange={(e) => setQuery(e.target.value)}
//                 placeholder="Search products…"
//                 className="w-full bg-transparent rounded-md pl-8 pr-2 py-2 text-[13px]"
//                 style={{ border: "1px solid var(--line)" }}
//               />
//             </div>
//           </div>
//           <div className="max-h-[240px] overflow-y-auto">
//             {filtered.length === 0 ? (
//               <div className="px-3 py-3 text-[12.5px]" style={{ color: "var(--muted)" }}>No matches.</div>
//             ) : (
//               filtered.map((p) => (
//                 <button
//                   key={p.id}
//                   type="button"
//                   onClick={() => { onSelect(p.id); setQuery(""); setOpen(false); }}
//                   className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[13.5px]"
//                   style={{ background: p.id === selectedId ? "rgba(201,150,62,0.15)" : "transparent" }}
//                 >
//                   <span className="truncate">{p.name}</span>
//                   <span className="mono text-[12px] shrink-0 ml-2" style={{ color: "var(--muted)" }}>{formatINR(p.price)}</span>
//                 </button>
//               ))
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ---------- create bill ----------
// function CreateBill() {
//   const [products, setProducts] = useState([]);
//   const [productId, setProductId] = useState("");
//   const [qty, setQty] = useState(1);
//   const [priceOverride, setPriceOverride] = useState("");
//   const [useDiscount, setUseDiscount] = useState(false);
//   const [discount, setDiscount] = useState("");
//   const [lineItems, setLineItems] = useState([]);
//   const [billDiscount, setBillDiscount] = useState("");
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
//   const [lastBill, setLastBill] = useState(null);
//   // Stays the same across retries of one bill attempt (e.g. if a request
//   // times out and the button is tapped again) so the backend recognizes
//   // it as the same attempt instead of creating a duplicate bill.
//   // Regenerated once a bill actually succeeds, starting a fresh attempt.
//   const [billKey, setBillKey] = useState(() => crypto.randomUUID());

//   useEffect(() => {
//     api.listProducts().then((ps) => {
//       setProducts(ps);
//       if (ps.length) setProductId(ps[0].id);
//     });
//   }, []);

//   const selected = products.find((p) => p.id === productId);
//   const discNum = useDiscount ? Math.min(100, Math.max(0, Number(discount) || 0)) : 0;
//   const qtyNum = Math.max(1, Number(qty) || 1);
//   const effectivePrice = priceOverride !== "" ? Number(priceOverride) || 0 : (selected?.price || 0);
//   const lineTotal = selected ? Math.round(effectivePrice * qtyNum * (1 - discNum / 100)) : 0;

//   useEffect(() => {
//     // reset the price field to the catalogue price whenever the product changes
//     setPriceOverride("");
//   }, [productId]);

//   function addLine(e) {
//     e.preventDefault();
//     if (!selected) return;
//     setLineItems((prev) => [
//       ...prev,
//       {
//         key: Date.now(),
//         product_id: selected.id,
//         name: selected.name,
//         unit_price: effectivePrice,
//         quantity: qtyNum,
//         discount_pct: discNum,
//         line_total: lineTotal,
//         was_overridden: priceOverride !== "" && Number(priceOverride) !== selected.price,
//       },
//     ]);
//     setQty(1);
//     setPriceOverride("");
//     setUseDiscount(false);
//     setDiscount("");
//   }

//   function removeLine(key) {
//     setLineItems((prev) => prev.filter((l) => l.key !== key));
//   }

//   const subtotal = lineItems.reduce((sum, l) => sum + l.line_total, 0);
//   const billDiscNum = Math.min(100, Math.max(0, Number(billDiscount) || 0));
//   const grandTotal = Math.round(subtotal * (1 - billDiscNum / 100));

//   async function finalizeBill() {
//     setError("");
//     setSubmitting(true);
//     try {
//       const bill = await api.createBill({
//         items: lineItems.map((l) => ({
//           product_id: l.product_id,
//           quantity: l.quantity,
//           discount_pct: l.discount_pct,
//           unit_price: l.unit_price,
//         })),
//         bill_discount_pct: billDiscNum,
//         idempotency_key: billKey,
//       });
//       setLastBill(bill);
//       setLineItems([]);
//       setBillDiscount("");
//       setBillKey(crypto.randomUUID()); // fresh key for the next bill
//     } catch (err) {
//       setError(err.message || "Could not create bill");
//       // billKey intentionally NOT regenerated here -- a retry after a
//       // failed/timed-out request should reuse the same key.
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   if (lastBill) {
//     return <BillReceipt bill={lastBill} onNewBill={() => setLastBill(null)} />;
//   }

//   return (
//     <div>
//       <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">Create bill</h1>
//       <p className="text-[13.5px] mb-7" style={{ color: "var(--muted)" }}>
//         Pick a product, adjust price or quantity if needed, and apply discounts per item or on the whole bill.
//       </p>

//       {products.length === 0 ? (
//         <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
//           <span style={{ color: "var(--muted)" }}>List a product first before creating a bill.</span>
//         </div>
//       ) : (
//         <div className="grid md:grid-cols-5 gap-8">
//           <form onSubmit={addLine} className="md:col-span-2 flex flex-col gap-4">
//             <Field label="Product">
//               <ProductPicker products={products} selectedId={productId} onSelect={setProductId} />
//             </Field>

//             <div className="grid grid-cols-2 gap-3">
//               <Field label="Quantity">
//                 <div className="flex items-center gap-1.5">
//                   <button type="button" onClick={() => setQty((q) => Math.max(1, Number(q) - 1))} className="w-8 h-9 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)" }}>
//                     <Minus size={13} />
//                   </button>
//                   <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)}
//                     className="w-full text-center bg-transparent rounded-md px-2 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
//                   <button type="button" onClick={() => setQty((q) => Math.max(1, Number(q) + 1))} className="w-8 h-9 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)" }}>
//                     <Plus size={13} />
//                   </button>
//                 </div>
//               </Field>

//               <Field label="Price per piece (₹)">
//                 <input
//                   type="number" min="0" step="0.01"
//                   value={priceOverride}
//                   placeholder={selected ? String(selected.price) : "0"}
//                   onChange={(e) => setPriceOverride(e.target.value)}
//                   className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono"
//                   style={{ border: "1px solid " + (priceOverride !== "" ? "var(--brass)" : "var(--line)"), background: "var(--panel)" }}
//                 />
//               </Field>
//             </div>
//             {priceOverride !== "" && selected && Number(priceOverride) !== selected.price && (
//               <div className="text-[11px] -mt-2" style={{ color: "var(--brass)" }}>
//                 Overriding catalogue price of {formatINR(selected.price)} for this bill only.
//               </div>
//             )}

//             <label className="flex items-center gap-2 text-[13px] mt-1" style={{ color: "var(--muted)" }}>
//               <input type="checkbox" checked={useDiscount} onChange={(e) => setUseDiscount(e.target.checked)} className="w-4 h-4" />
//               Apply a discount to this item
//             </label>

//             {useDiscount && (
//               <Field label="Item discount (%)">
//                 <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" autoFocus
//                   className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
//               </Field>
//             )}

//             <div className="rounded-md p-3 flex items-center justify-between" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//               <span className="text-[12px]" style={{ color: "var(--muted)" }}>Line total</span>
//               <span className="mono text-[16px] font-semibold">{formatINR(lineTotal)}</span>
//             </div>

//             <button type="submit" className="flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
//               <Plus size={16} />
//               Add to bill
//             </button>
//           </form>

//           <div className="md:col-span-3">
//             <SectionLabel>Bill</SectionLabel>
//             <div className="mt-2 rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
//               {lineItems.length === 0 ? (
//                 <div className="p-8 text-center text-[13px]" style={{ color: "var(--muted)" }}>No items added yet.</div>
//               ) : (
//                 <>
//                   {lineItems.map((l) => (
//                     <div key={l.key} className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid var(--line)", background: "var(--panel)" }}>
//                       <div>
//                         <div className="text-[13.5px] font-medium flex items-center gap-1.5">
//                           {l.name}
//                           {l.was_overridden && (
//                             <span className="mono text-[9.5px] px-1.5 py-0.5 rounded" style={{ background: "rgba(201,150,62,0.2)", color: "var(--brass)" }}>edited</span>
//                           )}
//                         </div>
//                         <div className="mono text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
//                           {l.quantity} × {formatINR(l.unit_price)}{l.discount_pct > 0 && ` · −${l.discount_pct}%`}
//                         </div>
//                       </div>
//                       <div className="flex items-center gap-3">
//                         <span className="mono text-[14.5px] font-semibold">{formatINR(l.line_total)}</span>
//                         <button onClick={() => removeLine(l.key)} style={{ color: "var(--muted)" }}><Trash2 size={15} /></button>
//                       </div>
//                     </div>
//                   ))}

//                   <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid var(--line)" }}>
//                     <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>Subtotal</span>
//                     <span className="mono text-[14px]">{formatINR(subtotal)}</span>
//                   </div>

//                   <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid var(--line)" }}>
//                     <label className="text-[12.5px] flex items-center gap-2" style={{ color: "var(--muted)" }}>
//                       Final bill discount (%)
//                     </label>
//                     <input
//                       type="number" min="0" max="100" value={billDiscount}
//                       onChange={(e) => setBillDiscount(e.target.value)}
//                       placeholder="0"
//                       className="w-20 text-right bg-transparent rounded-md px-2 py-1.5 text-[13px] mono"
//                       style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
//                     />
//                   </div>

//                   <div className="px-4 py-4 flex items-center justify-between" style={{ background: "var(--panel2)" }}>
//                     <span className="disp text-[14px] font-semibold" style={{ color: "var(--muted)" }}>GRAND TOTAL</span>
//                     <span className="mono text-[22px] font-semibold" style={{ color: "var(--brass)" }}>{formatINR(grandTotal)}</span>
//                   </div>
//                   {error && (
//                     <div className="text-[12.5px] px-4 py-2" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>{error}</div>
//                   )}
//                   <button onClick={finalizeBill} disabled={submitting} className="w-full py-3 text-[14px] font-semibold disp" style={{ background: "var(--teal)", color: "#14171C" }}>
//                     {submitting ? "Saving bill…" : "Finalize & save bill"}
//                   </button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// // ---------- printable receipt shown after a bill is saved ----------
// function BillReceipt({ bill, onNewBill }) {
//   return (
//     <div>
//       <div className="flex items-center justify-between mb-6 print:hidden">
//         <h1 className="disp text-[26px] font-semibold tracking-tight">Bill saved</h1>
//         <div className="flex gap-2">
//           <button onClick={() => window.print()} className="px-4 py-2 rounded-md text-[13.5px] font-medium" style={{ background: "var(--brass)", color: "#14171C" }}>
//             Print
//           </button>
//           <button onClick={onNewBill} className="px-4 py-2 rounded-md text-[13.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//             New bill
//           </button>
//         </div>
//       </div>

//       <div id="receipt" className="rounded-lg p-6 max-w-[480px]" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//         <div className="text-center mb-5">
//           <div className="disp text-[16px] font-semibold">Ledgerwatch</div>
//           <div className="mono text-[11px] mt-1" style={{ color: "var(--muted)" }}>{bill.bill_number}</div>
//           <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>{new Date(bill.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
//           <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>Billed by {bill.salesperson_name}</div>
//         </div>

//         <div style={{ borderTop: "1px dashed var(--line)", borderBottom: "1px dashed var(--line)" }} className="py-3 flex flex-col gap-2">
//           {bill.items.map((item, i) => (
//             <div key={i} className="flex items-center justify-between text-[13px]">
//               <div>
//                 <div>{item.name}</div>
//                 <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>
//                   {item.quantity} × {formatINR(item.unit_price)}{item.discount_pct > 0 && ` · −${item.discount_pct}%`}
//                 </div>
//               </div>
//               <span className="mono">{formatINR(item.line_total)}</span>
//             </div>
//           ))}
//         </div>

//         <div className="pt-3 flex flex-col gap-1.5">
//           <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--muted)" }}>
//             <span>Subtotal</span>
//             <span className="mono">{formatINR(bill.subtotal)}</span>
//           </div>
//           {bill.bill_discount_pct > 0 && (
//             <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--rust)" }}>
//               <span>Bill discount</span>
//               <span className="mono">−{bill.bill_discount_pct}%</span>
//             </div>
//           )}
//           <div className="flex items-center justify-between mt-1 pt-2" style={{ borderTop: "1px solid var(--line)" }}>
//             <span className="disp text-[14px] font-semibold">Total</span>
//             <span className="mono text-[19px] font-semibold" style={{ color: "var(--brass)" }}>{formatINR(bill.grand_total)}</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import React, { useState, useEffect, useRef } from "react";
import {
  TrendingUp, Package, UserPlus, Plus, LayoutDashboard,
  ShoppingBag, Circle, ArrowUpRight, Tag, X, Check,
  Receipt, Trash2, Minus, LogOut, Users, Loader2, Search, ChevronDown, Pencil
} from "lucide-react";
import { api } from "./api";

// ---------- helpers ----------
function useRollingNumber(target, duration = 900) {
  const [value, setValue] = useState(0);
  const raf = useRef(null);
  useEffect(() => {
    const start = performance.now();
    function tick(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    }
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current);
  }, [target, duration]);
  return value;
}

function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

function timestamp() {
  return new Date().toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" });
}

const THEME_VARS = {
  ["--bg"]: "#14171C", ["--panel"]: "#1B1F26", ["--panel2"]: "#20242C",
  ["--brass"]: "#C9963E", ["--brass-dim"]: "#8A6B34", ["--teal"]: "#3FA796",
  ["--rust"]: "#C1553D", ["--ivory"]: "#EDE8DE", ["--muted"]: "#8A8F98",
  ["--line"]: "#2A2F38",
};

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=IBM+Plex+Mono:wght@400;500;600&family=Inter:wght@400;500;600&display=swap');
  .console { background: var(--bg); color: var(--ivory); font-family: 'Inter', sans-serif; }
  .disp { font-family: 'Space Grotesk', sans-serif; }
  .mono { font-family: 'IBM Plex Mono', monospace; }
  .scanlines {
    background-image: repeating-linear-gradient(
      to bottom, rgba(255,255,255,0.035) 0px, rgba(255,255,255,0.035) 1px,
      transparent 1px, transparent 3px
    );
  }
  @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.25; } }
  .rec-dot { animation: blink 1.6s ease-in-out infinite; }
  @keyframes ticker { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
  .tick-track { animation: ticker 14s linear infinite; }
  .navlink { transition: color .15s ease, background .15s ease; }
  .card-hover { transition: transform .18s ease, border-color .18s ease; }
  .card-hover:hover { transform: translateY(-2px); border-color: var(--brass); }
  input:focus, select:focus { outline: none; border-color: var(--brass) !important; }
  ::selection { background: var(--brass); color: #14171C; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.8s linear infinite; }

  @media print {
    body * { visibility: hidden; }
    #receipt, #receipt * { visibility: visible; }
    #receipt {
      position: absolute; top: 0; left: 0; width: 100%;
      background: #fff !important; color: #111 !important;
      border: none !important;
    }
    .print\\:hidden { display: none !important; }
  }
`;

// ---------- root: auth gate ----------
export default function App() {
  const [authState, setAuthState] = useState("loading"); // loading | authed | unauthed
  const [user, setUser] = useState(null);
  const [resetToken, setResetToken] = useState(() => new URLSearchParams(window.location.search).get("reset_token"));

  useEffect(() => {
    if (resetToken) return; // skip the session check while on the reset-password screen
    api.me()
      .then((u) => { setUser(u); setAuthState("authed"); })
      .catch(() => setAuthState("unauthed"));
  }, [resetToken]);

  function clearResetToken() {
    setResetToken(null);
    window.history.replaceState({}, "", window.location.pathname);
  }

  return (
    <div style={THEME_VARS} className="w-full min-h-screen">
      <style>{GLOBAL_STYLE}</style>
      <div className="console min-h-screen">
        {resetToken && (
          <ResetPasswordScreen token={resetToken} onDone={clearResetToken} />
        )}
        {!resetToken && authState === "loading" && <FullScreenLoader />}
        {!resetToken && authState === "unauthed" && (
          <AuthScreen onAuthed={(u) => { setUser(u); setAuthState("authed"); }} />
        )}
        {!resetToken && authState === "authed" && user && (
          <Console
            user={user}
            onLogout={async () => {
              await api.logout();
              setUser(null);
              setAuthState("unauthed");
            }}
          />
        )}
      </div>
    </div>
  );
}

function FullScreenLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 size={28} className="spin" style={{ color: "var(--brass)" }} />
    </div>
  );
}

// ---------- auth screen (login / owner signup) ----------
function AuthScreen({ onAuthed }) {
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
        await api.forgotPassword({ email: form.email });
        setForgotSent(true);
        return;
      }
      const user =
        mode === "login"
          ? await api.login({ email: form.email, password: form.password })
          : await api.signup({
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

function ResetPasswordScreen({ token, onDone }) {
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
      await api.resetPassword({ token, new_password: password });
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

// ---------- console shell ----------
const DRAFT_BILL_STORAGE_KEY = "lw_draft_bill";

function loadDraftBill() {
  try {
    const raw = sessionStorage.getItem(DRAFT_BILL_STORAGE_KEY);
    if (!raw) return { lineItems: [], billDiscount: "" };
    const parsed = JSON.parse(raw);
    return { lineItems: parsed.lineItems || [], billDiscount: parsed.billDiscount || "" };
  } catch {
    return { lineItems: [], billDiscount: "" };
  }
}

function Console({ user, onLogout }) {
  const [view, setView] = useState(user.role === "admin" ? "dashboard" : "bill");
  const [showStaffModal, setShowStaffModal] = useState(false);

  // The in-progress bill lives here, not inside CreateBill, so switching
  // to another tab (Dashboard, Products) and back doesn't unmount
  // CreateBill and lose whatever the salesperson had already added.
  // sessionStorage backs it up too, so a refresh or the tab
  // being reopened still shows exactly where they left off.
  const [lineItems, setLineItems] = useState(() => loadDraftBill().lineItems);
  const [billDiscount, setBillDiscount] = useState(() => loadDraftBill().billDiscount);

  useEffect(() => {
    sessionStorage.setItem(DRAFT_BILL_STORAGE_KEY, JSON.stringify({ lineItems, billDiscount }));
  }, [lineItems, billDiscount]);

  const isAdminView = view === "dashboard" || view === "create";
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
          />
        )}
      </main>
      <Footer />
      <BottomNav view={view} setView={setView} user={user} />
      {showStaffModal && <StaffModal onClose={() => setShowStaffModal(false)} />}
    </div>
  );
}

function BottomNav({ view, setView, user }) {
  const allLinks = [
    { key: "dashboard", label: "Home", icon: LayoutDashboard, adminOnly: true },
    { key: "create", label: "Add", icon: Plus, adminOnly: true },
    { key: "products", label: "Products", icon: ShoppingBag, adminOnly: false },
    { key: "bill", label: "Bill", icon: Receipt, adminOnly: false },
  ];
  const links = allLinks.filter((l) => !l.adminOnly || user.role === "admin");

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-stretch"
      style={{ background: "var(--panel)", borderTop: "1px solid var(--line)" }}
    >
      {links.map(({ key, label, icon: Icon }) => (
        <button
          key={key}
          onClick={() => setView(key)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5"
          style={{ color: view === key ? "var(--brass)" : "var(--muted)" }}
        >
          <Icon size={19} />
          <span className="text-[10.5px] font-medium">{label}</span>
        </button>
      ))}
    </nav>
  );
}

function Topbar({ view, setView, user, onLogout, onAddStaff }) {
  const allLinks = [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: true },
    { key: "create", label: "Create product", icon: Plus, adminOnly: true },
    { key: "products", label: "Show products", icon: ShoppingBag, adminOnly: false },
    { key: "bill", label: "Create bill", icon: Receipt, adminOnly: false },
  ];
  const links = allLinks.filter((l) => !l.adminOnly || user.role === "admin");
  return (
    <header style={{ borderBottom: "1px solid var(--line)", background: "var(--panel)" }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 h-14 md:h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 md:gap-2.5">
          <div style={{ background: "var(--brass)" }} className="w-6 h-6 md:w-7 md:h-7 rounded-sm flex items-center justify-center shrink-0">
            <Circle size={11} strokeWidth={3} color="#14171C" />
          </div>
          <span className="disp text-[15px] md:text-[17px] font-semibold tracking-tight">Ledgerwatch</span>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="navlink flex items-center gap-1.5 px-3.5 py-2 rounded-md text-[13.5px] font-medium"
              style={{
                color: view === key ? "#14171C" : "var(--muted)",
                background: view === key ? "var(--brass)" : "transparent",
              }}
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-1.5 md:gap-2">
          {user.role === "admin" && (
            <button
              onClick={onAddStaff}
              className="flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-md text-[13px] font-medium"
              style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
              title="Add staff"
            >
              <Users size={14} />
              <span className="hidden lg:inline">Add staff</span>
            </button>
          )}
          <span className="mono text-[11px] hidden lg:inline" style={{ color: "var(--muted)" }}>
            {user.name} · {user.role}
          </span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-2.5 md:px-3 py-2 rounded-md text-[13px] font-medium"
            style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--line)" }} className="py-5 text-center">
      <span className="mono text-[11px]" style={{ color: "var(--muted)" }}>
        LEDGERWATCH · {new Date().getFullYear()}
      </span>
    </footer>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[12px]" style={{ color: "var(--muted)" }}>{label}</span>
      {children}
    </label>
  );
}

// ---------- staff creation modal (admin only) ----------
function StaffModal({ onClose }) {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  function loadStaff() {
    setLoading(true);
    api.getStaff().then(setStaff).finally(() => setLoading(false));
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

function StaffRow({ staffMember, onDeleted, onReactivated }) {
  const [confirming, setConfirming] = useState(false);
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");

  async function handleDeactivate() {
    setWorking(true);
    setError("");
    try {
      await api.deleteStaff(staffMember.id);
      onDeleted();
    } catch (err) {
      setError(err.message || "Could not deactivate this account");
      setWorking(false);
      setConfirming(false);
    }
  }

  async function handleReactivate() {
    setWorking(true);
    setError("");
    try {
      await api.reactivateStaff(staffMember.id);
      onReactivated();
    } catch (err) {
      setError(err.message || "Could not reactivate this account");
      setWorking(false);
    }
  }

  return (
    <div className="rounded-md px-3 py-2.5" style={{ border: "1px solid var(--line)", background: "var(--panel2)", opacity: staffMember.is_active ? 1 : 0.75 }}>
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 flex items-center gap-2">
          <div>
            <div className="text-[13.5px] font-medium truncate">{staffMember.name}</div>
            <div className="text-[11.5px] truncate" style={{ color: "var(--muted)" }}>{staffMember.email}</div>
          </div>
          <span
            className="mono text-[9.5px] px-1.5 py-0.5 rounded shrink-0"
            style={{
              background: staffMember.is_active ? "rgba(63,167,150,0.15)" : "rgba(138,143,152,0.2)",
              color: staffMember.is_active ? "var(--teal)" : "var(--muted)",
            }}
          >
            {staffMember.is_active ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>

        {staffMember.is_active ? (
          !confirming ? (
            <button onClick={() => setConfirming(true)} className="px-2.5 py-1.5 rounded-md text-[11.5px] font-medium shrink-0" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
              Deactivate
            </button>
          ) : (
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={handleDeactivate} disabled={working} className="px-2.5 py-1.5 rounded-md text-[11.5px] font-medium" style={{ background: "var(--rust)", color: "var(--ivory)" }}>
                {working ? "…" : "Confirm"}
              </button>
              <button onClick={() => setConfirming(false)} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)", color: "var(--muted)" }} title="Cancel">
                <X size={14} />
              </button>
            </div>
          )
        ) : (
          <button onClick={handleReactivate} disabled={working} className="px-2.5 py-1.5 rounded-md text-[11.5px] font-medium shrink-0" style={{ background: "var(--brass)", color: "#14171C" }}>
            {working ? "…" : "Reactivate"}
          </button>
        )}
      </div>
      {error && <div className="text-[11px] mt-1.5" style={{ color: "var(--rust)" }}>{error}</div>}
    </div>
  );
}

function AddStaffForm({ onBack, onCreated }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.createStaff(form);
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

// ---------- dashboard ----------
function groupBillsByDate(bills) {
  const groups = {};
  for (const bill of bills) {
    const d = new Date(bill.created_at);
    const key = d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata" });
    if (!groups[key]) groups[key] = [];
    groups[key].push(bill);
  }
  return groups; // insertion order == bills' order, and bills already arrive newest-first
}

const BILLS_PAGE_SIZE = 10;

function Dashboard({ canVoid }) {
  const [summary, setSummary] = useState(null);
  const [bills, setBills] = useState([]);
  const [page, setPage] = useState(0); // 0-indexed
  const [hasNextPage, setHasNextPage] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [clock, setClock] = useState(timestamp());
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);

  function loadPage(pageIndex) {
    setPageLoading(true);
    api.listBills(BILLS_PAGE_SIZE, pageIndex * BILLS_PAGE_SIZE)
      .then((b) => {
        setBills(b);
        // Fetched a full page -> there might be more after it. Fetched
        // fewer than a full page -> this is definitely the last page.
        setHasNextPage(b.length === BILLS_PAGE_SIZE);
      })
      .finally(() => setPageLoading(false));
  }

  useEffect(() => {
    setLoading(true);
    Promise.all([api.dashboardSummary(), api.listBills(BILLS_PAGE_SIZE, 0)])
      .then(([s, b]) => {
        setSummary(s);
        setBills(b);
        setHasNextPage(b.length === BILLS_PAGE_SIZE);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => setClock(timestamp()), 1000);
    return () => clearInterval(id);
  }, []);

  function goToPage(nextPage) {
    setPage(nextPage);
    loadPage(nextPage);
  }

  const todaySales = useRollingNumber(summary?.total_sales || 0);
  const orders = useRollingNumber(summary?.order_count || 0);

  if (loading) return <FullScreenLoader />;

  const grouped = groupBillsByDate(bills);
  const dateKeys = Object.keys(grouped);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="mono text-[11px] mb-2" style={{ color: "var(--brass)" }}>TODAY · {clock}</div>
        <h1 className="disp text-[28px] md:text-[34px] font-semibold tracking-tight">Today's sales</h1>
        <div className="mono text-[46px] md:text-[58px] font-semibold leading-none mt-2 tabular-nums">
          {formatINR(todaySales)}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard label="Orders today" value={orders} icon={Package} />
        <StatCard label="Avg. ticket size" value={formatINR(summary?.avg_ticket)} icon={TrendingUp} isText />
      </div>

      <div>
        <SectionLabel>All bills</SectionLabel>
        <div className="mt-2 rounded-lg overflow-hidden relative" style={{ background: "var(--panel)", border: "1px solid var(--line)", minHeight: 120 }}>
          {pageLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-10" style={{ background: "rgba(27,31,38,0.7)" }}>
              <Loader2 size={20} className="spin" style={{ color: "var(--brass)" }} />
            </div>
          )}
          {bills.length === 0 ? (
            <div className="p-8 text-center text-[13px]" style={{ color: "var(--muted)" }}>
              {page === 0 ? "No bills yet." : "No bills on this page."}
            </div>
          ) : (
            dateKeys.map((dateKey) => (
              <div key={dateKey}>
                <div className="px-4 py-2 mono text-[11px]" style={{ background: "var(--panel2)", color: "var(--muted)", position: "sticky", top: 0 }}>
                  {dateKey.toUpperCase()}
                </div>
                {grouped[dateKey].map((bill) => (
                  <button
                    key={bill.id}
                    onClick={() => setSelectedBill(bill)}
                    className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left"
                    style={{ borderBottom: "1px solid var(--line)" }}
                  >
                    <div>
                      <div className="mono text-[12.5px]">{bill.bill_number}</div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: "var(--muted)" }}>
                        {bill.salesperson_name} · {new Date(bill.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" })}
                      </div>
                    </div>
                    <span className="mono text-[14px] font-semibold" style={{ color: "var(--teal)" }}>{formatINR(bill.grand_total)}</span>
                  </button>
                ))}
              </div>
            ))
          )}

          {(page > 0 || hasNextPage) && (
            <div className="flex items-center justify-between px-4 py-3" style={{ borderTop: "1px solid var(--line)", background: "var(--panel2)" }}>
              <button
                onClick={() => goToPage(page - 1)}
                disabled={page === 0 || pageLoading}
                className="px-3 py-1.5 rounded-md text-[12.5px] font-medium"
                style={{ color: page === 0 ? "var(--muted)" : "var(--brass)", opacity: page === 0 ? 0.4 : 1 }}
              >
                ← Previous
              </button>
              <span className="mono text-[11px]" style={{ color: "var(--muted)" }}>Page {page + 1}</span>
              <button
                onClick={() => goToPage(page + 1)}
                disabled={!hasNextPage || pageLoading}
                className="px-3 py-1.5 rounded-md text-[12.5px] font-medium"
                style={{ color: !hasNextPage ? "var(--muted)" : "var(--brass)", opacity: !hasNextPage ? 0.4 : 1 }}
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </div>

      {selectedBill && (
        <BillDetailModal
          bill={selectedBill}
          onClose={() => setSelectedBill(null)}
          canVoid={canVoid}
          onVoided={() => {
            setSelectedBill(null);
            loadPage(page);
            api.dashboardSummary().then(setSummary);
          }}
        />
      )}
    </div>
  );
}

function BillDetailModal({ bill, onClose, canVoid, onVoided }) {
  const [confirmingVoid, setConfirmingVoid] = useState(false);
  const [voiding, setVoiding] = useState(false);
  const [voidError, setVoidError] = useState("");

  async function handleVoid() {
    setVoiding(true);
    setVoidError("");
    try {
      await api.voidBill(bill.id);
      onVoided(bill.id);
    } catch (err) {
      setVoidError(err.message || "Could not void this bill");
      setConfirmingVoid(false);
    } finally {
      setVoiding(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 print:hidden" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-[480px] max-h-[90vh] overflow-y-auto rounded-lg relative">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div>
            {canVoid && !confirmingVoid && (
              <button onClick={() => setConfirmingVoid(true)} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--rust)", color: "var(--rust)" }}>
                Void bill
              </button>
            )}
            {confirmingVoid && (
              <div className="flex items-center gap-2">
                <span className="text-[12.5px]" style={{ color: "var(--rust)" }}>Void this bill? This can't be undone.</span>
                <button onClick={handleVoid} disabled={voiding} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ background: "var(--rust)", color: "var(--ivory)" }}>
                  {voiding ? "Voiding…" : "Confirm"}
                </button>
                <button onClick={() => setConfirmingVoid(false)} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ background: "var(--brass)", color: "#14171C" }}>
              Print
            </button>
            <button onClick={onClose} className="px-3 py-1.5 rounded-md text-[12.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
              Close
            </button>
          </div>
        </div>
        {voidError && (
          <div className="mb-2 text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
            {voidError}
          </div>
        )}
        <div id="receipt" className="rounded-lg p-6" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          <div className="text-center mb-5">
            <div className="disp text-[16px] font-semibold">Ledgerwatch</div>
            <div className="mono text-[11px] mt-1" style={{ color: "var(--muted)" }}>{bill.bill_number}</div>
            <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>{new Date(bill.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
            <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>Billed by {bill.salesperson_name}</div>
          </div>
          <div style={{ borderTop: "1px dashed var(--line)", borderBottom: "1px dashed var(--line)" }} className="py-3 flex flex-col gap-2">
            {bill.items.map((item, i) => (
              <div key={i} className="flex items-center justify-between text-[13px]">
                <div>
                  <div>{item.name}</div>
                  <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>
                    {item.quantity} × {formatINR(item.unit_price)}{item.discount_pct > 0 && ` · −${item.discount_pct}%`}
                  </div>
                </div>
                <span className="mono">{formatINR(item.line_total)}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--muted)" }}>
              <span>Subtotal</span>
              <span className="mono">{formatINR(bill.subtotal)}</span>
            </div>
            {bill.bill_discount_pct > 0 && (
              <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--rust)" }}>
                <span>Bill discount</span>
                <span className="mono">−{bill.bill_discount_pct}%</span>
              </div>
            )}
            <div className="flex items-center justify-between mt-1 pt-2" style={{ borderTop: "1px solid var(--line)" }}>
              <span className="disp text-[14px] font-semibold">Total</span>
              <span className="mono text-[19px] font-semibold" style={{ color: "var(--brass)" }}>{formatINR(bill.grand_total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="disp text-[13px] font-semibold tracking-wide" style={{ color: "var(--muted)" }}>
        {String(children).toUpperCase()}
      </span>
      <div className="flex-1 h-px" style={{ background: "var(--line)" }} />
    </div>
  );
}

function StatCard({ label, value, icon: Icon, isText }) {
  return (
    <div className="card-hover rounded-lg p-4" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px]" style={{ color: "var(--muted)" }}>{label}</span>
        <Icon size={15} style={{ color: "var(--brass)" }} />
      </div>
      <div className={isText ? "disp text-[16px] font-semibold" : "mono text-[24px] font-semibold tabular-nums"}>
        {value}
      </div>
    </div>
  );
}

// ---------- create product ----------
function CreateProduct({ onCreated }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const priceNum = Number(price) || 0;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name || !priceNum) return;
    setLoading(true);
    try {
      const payload = { name, price: priceNum };
      // Leaving quantity blank omits the key entirely -- the backend
      // treats that as "not tracking inventory for this product" rather
      // than "zero stock," so it's never blocked from being sold.
      if (quantity !== "") payload.quantity = Number(quantity);
      await api.createProduct(payload);
      onCreated();
    } catch (err) {
      setError(err.message || "Could not create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">List a new product</h1>
      <p className="text-[13.5px] mb-7" style={{ color: "var(--muted)" }}>
        Set the name and price per piece. Discounts are applied per-bill, not here.
      </p>
      <div className="grid md:grid-cols-5 gap-8">
        <form onSubmit={handleSubmit} className="md:col-span-3 flex flex-col gap-4">
          <Field label="Product name">
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kanjivaram Silk Saree"
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
          </Field>
          <Field label="Price per piece (₹)">
            <input type="number" min="0" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0"
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
          </Field>
          <Field label="Quantity in stock (optional)">
            <input type="number" min="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="Leave blank to not track stock"
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
          </Field>
          {error && (
            <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>{error}</div>
          )}
          <button type="submit" disabled={loading} className="mt-2 flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp"
            style={{ background: "var(--brass)", color: "#14171C" }}>
            <Plus size={16} />
            {loading ? "Adding…" : "Add product"}
          </button>
        </form>
        <div className="md:col-span-2">
          <div className="mono text-[11px] mb-2" style={{ color: "var(--muted)" }}>LIVE PREVIEW</div>
          <ProductCard product={{ name: name || "Untitled product", price: priceNum, quantity: quantity === "" ? 0 : Number(quantity) }} preview />
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, compact, preview, onEdit, onDelete }) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <div className="card-hover rounded-lg p-4 flex flex-col gap-3 relative"
      style={{ background: "var(--panel)", border: preview ? "1px solid var(--brass-dim)" : "1px solid var(--line)" }}>
      {(onEdit || onDelete) && !confirmingDelete && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          {onEdit && (
            <button onClick={onEdit} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ color: "var(--muted)" }} title="Edit product">
              <Pencil size={14} />
            </button>
          )}
          {onDelete && (
            <button onClick={() => setConfirmingDelete(true)} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ color: "var(--muted)" }} title="Delete product">
              <Trash2 size={14} />
            </button>
          )}
        </div>
      )}
      {confirmingDelete && (
        <div className="absolute top-3 right-3 flex items-center gap-1">
          <span className="text-[11px] mr-1" style={{ color: "var(--rust)" }}>Remove?</span>
          <button onClick={() => { onDelete(); setConfirmingDelete(false); }} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ background: "var(--rust)", color: "var(--ivory)" }} title="Confirm delete">
            <Check size={14} />
          </button>
          <button onClick={() => setConfirmingDelete(false)} className="w-7 h-7 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)", color: "var(--muted)" }} title="Cancel">
            <X size={14} />
          </button>
        </div>
      )}
      <div className="disp text-[15px] font-semibold leading-snug pr-6">{product.name}</div>
      <div className="mono text-[19px] font-semibold">{formatINR(product.price)}</div>
      {!compact && (
        <div className="text-[12px]" style={{ color: "var(--muted)" }}>
          {product.quantity} in stock · discounts applied when billing.
        </div>
      )}
    </div>
  );
}

// ---------- products view ----------
function Products({ canEdit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    api.listProducts().then(setProducts).finally(() => setLoading(false));
  }, []);

  if (loading) return <FullScreenLoader />;

  const filtered = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : products;

  async function handleDelete(productId) {
    try {
      await api.deleteProduct(productId);
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    } catch (err) {
      alert(err.message || "Could not delete product");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="disp text-[26px] font-semibold tracking-tight">Catalogue</h1>
        <span className="mono text-[12px]" style={{ color: "var(--muted)" }}>
          {query ? `${filtered.length} of ${products.length}` : `${products.length} listed`}
        </span>
      </div>
      <p className="text-[13.5px] mb-4" style={{ color: "var(--muted)" }}>Everything currently live for sale.</p>

      {products.length > 0 && (
        <div className="relative mb-6 max-w-[360px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-transparent rounded-md pl-9 pr-3 py-2.5 text-[14px]"
            style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
          />
        </div>
      )}

      {products.length === 0 ? (
        <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
          <span style={{ color: "var(--muted)" }}>Nothing listed yet. Create your first product to see it here.</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
          <span style={{ color: "var(--muted)" }}>No products match "{query}".</span>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onEdit={canEdit ? () => setEditingProduct(p) : undefined}
              onDelete={canEdit ? () => handleDelete(p.id) : undefined}
            />
          ))}
        </div>
      )}

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSaved={(updated) => {
            setProducts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

function EditProductModal({ product, onClose, onSaved }) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [quantity, setQuantity] = useState(String(product.quantity ?? 0));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const priceNum = Number(price);
    if (!name.trim() || !priceNum || priceNum <= 0) {
      setError("Enter a valid name and price.");
      return;
    }
    setSaving(true);
    try {
      const updated = await api.updateProduct(product.id, {
        name: name.trim(),
        price: priceNum,
        quantity: quantity === "" ? undefined : Number(quantity),
      });
      onSaved(updated);
    } catch (err) {
      setError(err.message || "Could not update product");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
      <div className="w-full max-w-[400px] rounded-lg p-6 relative" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <button onClick={onClose} className="absolute top-4 right-4" style={{ color: "var(--muted)" }}>
          <X size={18} />
        </button>
        <h2 className="disp text-[18px] font-semibold mb-5">Edit product</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Field label="Product name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px]"
              style={{ border: "1px solid var(--line)" }}
            />
          </Field>
          <Field label="Price per piece (₹)">
            <input
              type="number" min="0" step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono"
              style={{ border: "1px solid var(--line)" }}
            />
          </Field>
          <Field label="Quantity in stock">
            <input
              type="number" min="0"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono"
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
            disabled={saving}
            className="mt-2 rounded-md py-2.5 text-[14px] font-semibold disp"
            style={{ background: "var(--brass)", color: "#14171C" }}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ---------- searchable product picker, for bill creation with many products ----------
function ProductPicker({ products, selectedId, onSelect }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selected = products.find((p) => p.id === selectedId);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = query.trim()
    ? products.filter((p) => p.name.toLowerCase().includes(query.trim().toLowerCase()))
    : products;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between rounded-md px-3 py-2.5 text-[14px] text-left"
        style={{ border: "1px solid var(--line)", background: "var(--panel)", color: "var(--ivory)" }}
      >
        <span className="truncate">{selected ? `${selected.name} — ${formatINR(selected.price)}` : "Select a product"}</span>
        <ChevronDown size={15} style={{ color: "var(--muted)" }} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1 w-full rounded-md overflow-hidden" style={{ background: "var(--panel2)", border: "1px solid var(--line)" }}>
          <div className="p-2" style={{ borderBottom: "1px solid var(--line)" }}>
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "var(--muted)" }} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full bg-transparent rounded-md pl-8 pr-2 py-2 text-[13px]"
                style={{ border: "1px solid var(--line)" }}
              />
            </div>
          </div>
          <div className="max-h-[240px] overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="px-3 py-3 text-[12.5px]" style={{ color: "var(--muted)" }}>No matches.</div>
            ) : (
              filtered.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => { onSelect(p.id); setQuery(""); setOpen(false); }}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-left text-[13.5px]"
                  style={{ background: p.id === selectedId ? "rgba(201,150,62,0.15)" : "transparent" }}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="mono text-[12px] shrink-0 ml-2" style={{ color: "var(--muted)" }}>{formatINR(p.price)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- create bill ----------
function CreateBill({ lineItems, setLineItems, billDiscount, setBillDiscount }) {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState(1);
  const [priceOverride, setPriceOverride] = useState("");
  const [useDiscount, setUseDiscount] = useState(false);
  const [discount, setDiscount] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [lastBill, setLastBill] = useState(null);
  // Stays the same across retries of one bill attempt (e.g. if a request
  // times out and the button is tapped again) so the backend recognizes
  // it as the same attempt instead of creating a duplicate bill.
  // Regenerated once a bill actually succeeds, starting a fresh attempt.
  const [billKey, setBillKey] = useState(() => crypto.randomUUID());

  useEffect(() => {
    api.listProducts().then((ps) => {
      setProducts(ps);
      if (ps.length) setProductId(ps[0].id);
    });
  }, []);

  const selected = products.find((p) => p.id === productId);
  const discNum = useDiscount ? Math.min(100, Math.max(0, Number(discount) || 0)) : 0;
  const qtyNum = Math.max(1, Number(qty) || 1);
  const effectivePrice = priceOverride !== "" ? Number(priceOverride) || 0 : (selected?.price || 0);
  const lineTotal = selected ? Math.round(effectivePrice * qtyNum * (1 - discNum / 100)) : 0;

  useEffect(() => {
    // reset the price field to the catalogue price whenever the product changes
    setPriceOverride("");
  }, [productId]);

  function addLine(e) {
    e.preventDefault();
    if (!selected) return;
    setLineItems((prev) => [
      ...prev,
      {
        key: Date.now(),
        product_id: selected.id,
        name: selected.name,
        unit_price: effectivePrice,
        quantity: qtyNum,
        discount_pct: discNum,
        line_total: lineTotal,
        was_overridden: priceOverride !== "" && Number(priceOverride) !== selected.price,
      },
    ]);
    setQty(1);
    setPriceOverride("");
    setUseDiscount(false);
    setDiscount("");
  }

  function removeLine(key) {
    setLineItems((prev) => prev.filter((l) => l.key !== key));
  }

  const subtotal = lineItems.reduce((sum, l) => sum + l.line_total, 0);
  const billDiscNum = Math.min(100, Math.max(0, Number(billDiscount) || 0));
  const grandTotal = Math.round(subtotal * (1 - billDiscNum / 100));

  async function finalizeBill() {
    setError("");
    setSubmitting(true);
    try {
      const bill = await api.createBill({
        items: lineItems.map((l) => ({
          product_id: l.product_id,
          quantity: l.quantity,
          discount_pct: l.discount_pct,
          unit_price: l.unit_price,
        })),
        bill_discount_pct: billDiscNum,
        idempotency_key: billKey,
      });
      setLastBill(bill);
      setLineItems([]);
      setBillDiscount("");
      sessionStorage.removeItem(DRAFT_BILL_STORAGE_KEY); // bill is saved server-side now, no draft to keep
      setBillKey(crypto.randomUUID()); // fresh key for the next bill
    } catch (err) {
      setError(err.message || "Could not create bill");
      // billKey intentionally NOT regenerated here -- a retry after a
      // failed/timed-out request should reuse the same key.
    } finally {
      setSubmitting(false);
    }
  }

  if (lastBill) {
    return <BillReceipt bill={lastBill} onNewBill={() => setLastBill(null)} />;
  }

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">Create bill</h1>
      <p className="text-[13.5px] mb-7" style={{ color: "var(--muted)" }}>
        Pick a product, adjust price or quantity if needed, and apply discounts per item or on the whole bill.
      </p>

      {products.length === 0 ? (
        <div className="rounded-lg p-10 text-center" style={{ border: "1px dashed var(--line)" }}>
          <span style={{ color: "var(--muted)" }}>List a product first before creating a bill.</span>
        </div>
      ) : (
        <div className="grid md:grid-cols-5 gap-8">
          <form onSubmit={addLine} className="md:col-span-2 flex flex-col gap-4">
            <Field label="Product">
              <ProductPicker products={products} selectedId={productId} onSelect={setProductId} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Quantity">
                <div className="flex items-center gap-1.5">
                  <button type="button" onClick={() => setQty((q) => Math.max(1, Number(q) - 1))} className="w-8 h-9 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)" }}>
                    <Minus size={13} />
                  </button>
                  <input type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)}
                    className="w-full text-center bg-transparent rounded-md px-2 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
                  <button type="button" onClick={() => setQty((q) => Math.max(1, Number(q) + 1))} className="w-8 h-9 flex items-center justify-center rounded-md" style={{ border: "1px solid var(--line)" }}>
                    <Plus size={13} />
                  </button>
                </div>
              </Field>

              <Field label="Price per piece (₹)">
                <input
                  type="number" min="0" step="0.01"
                  value={priceOverride}
                  placeholder={selected ? String(selected.price) : "0"}
                  onChange={(e) => setPriceOverride(e.target.value)}
                  className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono"
                  style={{ border: "1px solid " + (priceOverride !== "" ? "var(--brass)" : "var(--line)"), background: "var(--panel)" }}
                />
              </Field>
            </div>
            {priceOverride !== "" && selected && Number(priceOverride) !== selected.price && (
              <div className="text-[11px] -mt-2" style={{ color: "var(--brass)" }}>
                Overriding catalogue price of {formatINR(selected.price)} for this bill only.
              </div>
            )}

            <label className="flex items-center gap-2 text-[13px] mt-1" style={{ color: "var(--muted)" }}>
              <input type="checkbox" checked={useDiscount} onChange={(e) => setUseDiscount(e.target.checked)} className="w-4 h-4" />
              Apply a discount to this item
            </label>

            {useDiscount && (
              <Field label="Item discount (%)">
                <input type="number" min="0" max="100" value={discount} onChange={(e) => setDiscount(e.target.value)} placeholder="0" autoFocus
                  className="w-full bg-transparent rounded-md px-3 py-2.5 text-[14px] mono" style={{ border: "1px solid var(--line)", background: "var(--panel)" }} />
              </Field>
            )}

            <div className="rounded-md p-3 flex items-center justify-between" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
              <span className="text-[12px]" style={{ color: "var(--muted)" }}>Line total</span>
              <span className="mono text-[16px] font-semibold">{formatINR(lineTotal)}</span>
            </div>

            <button type="submit" className="flex items-center justify-center gap-2 rounded-md py-2.5 text-[14px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
              <Plus size={16} />
              Add to bill
            </button>
          </form>

          <div className="md:col-span-3">
            <SectionLabel>Bill</SectionLabel>
            <div className="mt-2 rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
              {lineItems.length === 0 ? (
                <div className="p-8 text-center text-[13px]" style={{ color: "var(--muted)" }}>No items added yet.</div>
              ) : (
                <>
                  {lineItems.map((l) => (
                    <div key={l.key} className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid var(--line)", background: "var(--panel)" }}>
                      <div>
                        <div className="text-[13.5px] font-medium flex items-center gap-1.5">
                          {l.name}
                          {l.was_overridden && (
                            <span className="mono text-[9.5px] px-1.5 py-0.5 rounded" style={{ background: "rgba(201,150,62,0.2)", color: "var(--brass)" }}>edited</span>
                          )}
                        </div>
                        <div className="mono text-[11px] mt-0.5" style={{ color: "var(--muted)" }}>
                          {l.quantity} × {formatINR(l.unit_price)}{l.discount_pct > 0 && ` · −${l.discount_pct}%`}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="mono text-[14.5px] font-semibold">{formatINR(l.line_total)}</span>
                        <button onClick={() => removeLine(l.key)} style={{ color: "var(--muted)" }}><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}

                  <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid var(--line)" }}>
                    <span className="text-[12.5px]" style={{ color: "var(--muted)" }}>Subtotal</span>
                    <span className="mono text-[14px]">{formatINR(subtotal)}</span>
                  </div>

                  <div className="px-4 py-3 flex items-center justify-between gap-3" style={{ borderBottom: "1px solid var(--line)" }}>
                    <label className="text-[12.5px] flex items-center gap-2" style={{ color: "var(--muted)" }}>
                      Final bill discount (%)
                    </label>
                    <input
                      type="number" min="0" max="100" value={billDiscount}
                      onChange={(e) => setBillDiscount(e.target.value)}
                      placeholder="0"
                      className="w-20 text-right bg-transparent rounded-md px-2 py-1.5 text-[13px] mono"
                      style={{ border: "1px solid var(--line)", background: "var(--panel)" }}
                    />
                  </div>

                  <div className="px-4 py-4 flex items-center justify-between" style={{ background: "var(--panel2)" }}>
                    <span className="disp text-[14px] font-semibold" style={{ color: "var(--muted)" }}>GRAND TOTAL</span>
                    <span className="mono text-[22px] font-semibold" style={{ color: "var(--brass)" }}>{formatINR(grandTotal)}</span>
                  </div>
                  {error && (
                    <div className="text-[12.5px] px-4 py-2" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>{error}</div>
                  )}
                  <button onClick={finalizeBill} disabled={submitting} className="w-full py-3 text-[14px] font-semibold disp" style={{ background: "var(--teal)", color: "#14171C" }}>
                    {submitting ? "Saving bill…" : "Finalize & save bill"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- printable receipt shown after a bill is saved ----------
function BillReceipt({ bill, onNewBill }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 print:hidden">
        <h1 className="disp text-[26px] font-semibold tracking-tight">Bill saved</h1>
        <div className="flex gap-2">
          <button onClick={() => window.print()} className="px-4 py-2 rounded-md text-[13.5px] font-medium" style={{ background: "var(--brass)", color: "#14171C" }}>
            Print
          </button>
          <button onClick={onNewBill} className="px-4 py-2 rounded-md text-[13.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
            New bill
          </button>
        </div>
      </div>

      <div id="receipt" className="rounded-lg p-6 max-w-[480px]" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
        <div className="text-center mb-5">
          <div className="disp text-[16px] font-semibold">Ledgerwatch</div>
          <div className="mono text-[11px] mt-1" style={{ color: "var(--muted)" }}>{bill.bill_number}</div>
          <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>{new Date(bill.created_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</div>
          <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>Billed by {bill.salesperson_name}</div>
        </div>

        <div style={{ borderTop: "1px dashed var(--line)", borderBottom: "1px dashed var(--line)" }} className="py-3 flex flex-col gap-2">
          {bill.items.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-[13px]">
              <div>
                <div>{item.name}</div>
                <div className="mono text-[11px]" style={{ color: "var(--muted)" }}>
                  {item.quantity} × {formatINR(item.unit_price)}{item.discount_pct > 0 && ` · −${item.discount_pct}%`}
                </div>
              </div>
              <span className="mono">{formatINR(item.line_total)}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--muted)" }}>
            <span>Subtotal</span>
            <span className="mono">{formatINR(bill.subtotal)}</span>
          </div>
          {bill.bill_discount_pct > 0 && (
            <div className="flex items-center justify-between text-[12.5px]" style={{ color: "var(--rust)" }}>
              <span>Bill discount</span>
              <span className="mono">−{bill.bill_discount_pct}%</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-1 pt-2" style={{ borderTop: "1px solid var(--line)" }}>
            <span className="disp text-[14px] font-semibold">Total</span>
            <span className="mono text-[19px] font-semibold" style={{ color: "var(--brass)" }}>{formatINR(bill.grand_total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}