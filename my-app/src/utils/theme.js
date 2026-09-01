export const THEME_VARS = {
  ["--bg"]: "#14171C", ["--panel"]: "#1B1F26", ["--panel2"]: "#20242C",
  ["--brass"]: "#C9963E", ["--brass-dim"]: "#8A6B34", ["--teal"]: "#3FA796",
  ["--rust"]: "#C1553D", ["--ivory"]: "#EDE8DE", ["--muted"]: "#8A8F98",
  ["--line"]: "#2A2F38",
};

export const GLOBAL_STYLE = `
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
