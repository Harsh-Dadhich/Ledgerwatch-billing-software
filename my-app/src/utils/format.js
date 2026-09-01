export function formatINR(n) {
  return "₹" + Number(n || 0).toLocaleString("en-IN");
}

export function timestamp() {
  return new Date().toLocaleTimeString("en-IN", { hour12: false, timeZone: "Asia/Kolkata" });
}

export function groupBillsByDate(bills) {
  const groups = {};
  for (const bill of bills) {
    const d = new Date(bill.created_at);
    const key = d.toLocaleDateString("en-IN", {
      weekday: "short", day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata",
    });
    if (!groups[key]) groups[key] = [];
    groups[key].push(bill);
  }
  return groups; // insertion order == bills' order, and bills already arrive newest-first
}
