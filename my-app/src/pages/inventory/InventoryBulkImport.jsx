import { Upload } from "lucide-react";
import { mockBulkImportPreview as preview } from "../../data/mockInventory";

export function InventoryBulkImport() {
  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-6">Import products</h1>

      <div className="max-w-[520px] flex flex-col gap-6">
        <div className="rounded-lg p-6 text-center" style={{ border: "1px dashed var(--line)" }}>
          <Upload size={28} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <button className="px-4 py-2 rounded-md text-[13px] font-medium mb-2" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
            Choose file
          </button>
          <div className="mono text-[12px]" style={{ color: "var(--muted)" }}>{preview.fileName}</div>
        </div>

        <div>
          <div className="mono text-[11px] mb-2" style={{ color: "var(--brass)" }}>DETECTED COLUMNS</div>
          <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
            {preview.detectedColumns.map((col, i) => (
              <div key={i} className="px-4 py-2.5 flex items-center justify-between text-[13px]" style={{ borderBottom: i < preview.detectedColumns.length - 1 ? "1px solid var(--line)" : "none" }}>
                <span style={{ color: "var(--muted)" }}>{col.source}</span>
                <span>→ {col.mapsTo}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg p-4 grid grid-cols-3 gap-3 text-center" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
          <div>
            <div className="mono text-[20px] font-semibold">{preview.rowsFound.toLocaleString("en-IN")}</div>
            <div className="text-[11px]" style={{ color: "var(--muted)" }}>Rows found</div>
          </div>
          <div>
            <div className="mono text-[20px] font-semibold" style={{ color: "var(--teal)" }}>{preview.validRows.toLocaleString("en-IN")}</div>
            <div className="text-[11px]" style={{ color: "var(--muted)" }}>Valid</div>
          </div>
          <div>
            <div className="mono text-[20px] font-semibold" style={{ color: "var(--rust)" }}>{preview.errors}</div>
            <div className="text-[11px]" style={{ color: "var(--muted)" }}>Errors</div>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 rounded-md py-2.5 text-[13.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
            Download error file
          </button>
          <button className="flex-1 rounded-md py-2.5 text-[13.5px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
            Import products
          </button>
        </div>
      </div>
    </div>
  );
}
