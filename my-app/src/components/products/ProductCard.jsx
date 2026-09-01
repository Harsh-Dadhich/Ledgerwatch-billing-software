import { useState } from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import { formatINR } from "../../utils/format";

export function ProductCard({ product, compact, preview, onEdit, onDelete }) {
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
