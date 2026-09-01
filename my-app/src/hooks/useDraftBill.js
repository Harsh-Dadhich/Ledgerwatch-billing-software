import { useEffect, useState } from "react";

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

/**
 * The in-progress bill lives here, one level above CreateBill, so
 * switching to another tab (Dashboard, Products) and back doesn't
 * unmount CreateBill and lose whatever the salesperson had already
 * added. sessionStorage backs it up too, so a refresh or the tab being
 * reopened still shows exactly where they left off.
 */
export function useDraftBill() {
  const [lineItems, setLineItems] = useState(() => loadDraftBill().lineItems);
  const [billDiscount, setBillDiscount] = useState(() => loadDraftBill().billDiscount);

  useEffect(() => {
    sessionStorage.setItem(DRAFT_BILL_STORAGE_KEY, JSON.stringify({ lineItems, billDiscount }));
  }, [lineItems, billDiscount]);

  function clearDraft() {
    setLineItems([]);
    setBillDiscount("");
    sessionStorage.removeItem(DRAFT_BILL_STORAGE_KEY); // bill is saved server-side now, no draft to keep
  }

  return { lineItems, setLineItems, billDiscount, setBillDiscount, clearDraft };
}
