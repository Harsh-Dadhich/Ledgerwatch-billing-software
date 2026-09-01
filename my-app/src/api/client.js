const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8000";

export async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    // Required so the browser sends/receives the httpOnly auth cookies.
    // Without this, every request after login would look unauthenticated.
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = data.detail || detail;
    } catch {
      // response wasn't JSON, fall back to statusText
    }
    throw new Error(detail);
  }

  if (res.status === 204) return null;
  return res.json();
}
