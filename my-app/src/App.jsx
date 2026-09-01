import { useEffect, useState } from "react";
import { FullScreenLoader } from "./components/common/FullScreenLoader";
import { AuthScreen } from "./pages/AuthScreen";
import { ResetPasswordScreen } from "./pages/ResetPasswordScreen";
import { Console } from "./Console";
import { THEME_VARS, GLOBAL_STYLE } from "./utils/theme";
import { authApi } from "./api/auth";

export default function App() {
  const [authState, setAuthState] = useState("loading"); // loading | authed | unauthed
  const [user, setUser] = useState(null);
  const [resetToken, setResetToken] = useState(() => new URLSearchParams(window.location.search).get("reset_token"));

  useEffect(() => {
    if (resetToken) return; // skip the session check while on the reset-password screen
    authApi.me()
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
              await authApi.logout();
              setUser(null);
              setAuthState("unauthed");
            }}
          />
        )}
      </div>
    </div>
  );
}
