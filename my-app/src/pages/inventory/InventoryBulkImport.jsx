// import { Upload } from "lucide-react";
// import { mockBulkImportPreview as preview } from "../../data/mockInventory";

// export function InventoryBulkImport() {
//   return (
//     <div>
//       <h1 className="disp text-[26px] font-semibold tracking-tight mb-6">Import products</h1>

//       <div className="max-w-[520px] flex flex-col gap-6">
//         <div className="rounded-lg p-6 text-center" style={{ border: "1px dashed var(--line)" }}>
//           <Upload size={28} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
//           <button className="px-4 py-2 rounded-md text-[13px] font-medium mb-2" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//             Choose file
//           </button>
//           <div className="mono text-[12px]" style={{ color: "var(--muted)" }}>{preview.fileName}</div>
//         </div>

//         <div>
//           <div className="mono text-[11px] mb-2" style={{ color: "var(--brass)" }}>DETECTED COLUMNS</div>
//           <div className="rounded-lg overflow-hidden" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//             {preview.detectedColumns.map((col, i) => (
//               <div key={i} className="px-4 py-2.5 flex items-center justify-between text-[13px]" style={{ borderBottom: i < preview.detectedColumns.length - 1 ? "1px solid var(--line)" : "none" }}>
//                 <span style={{ color: "var(--muted)" }}>{col.source}</span>
//                 <span>→ {col.mapsTo}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="rounded-lg p-4 grid grid-cols-3 gap-3 text-center" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
//           <div>
//             <div className="mono text-[20px] font-semibold">{preview.rowsFound.toLocaleString("en-IN")}</div>
//             <div className="text-[11px]" style={{ color: "var(--muted)" }}>Rows found</div>
//           </div>
//           <div>
//             <div className="mono text-[20px] font-semibold" style={{ color: "var(--teal)" }}>{preview.validRows.toLocaleString("en-IN")}</div>
//             <div className="text-[11px]" style={{ color: "var(--muted)" }}>Valid</div>
//           </div>
//           <div>
//             <div className="mono text-[20px] font-semibold" style={{ color: "var(--rust)" }}>{preview.errors}</div>
//             <div className="text-[11px]" style={{ color: "var(--muted)" }}>Errors</div>
//           </div>
//         </div>

//         <div className="flex gap-2">
//           <button className="flex-1 rounded-md py-2.5 text-[13.5px] font-medium" style={{ border: "1px solid var(--line)", color: "var(--muted)" }}>
//             Download error file
//           </button>
//           <button className="flex-1 rounded-md py-2.5 text-[13.5px] font-semibold disp" style={{ background: "var(--brass)", color: "#14171C" }}>
//             Import products
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { Upload, Download, Loader2 } from "lucide-react";
import { productsApi } from "../../api/products";
import { requestFile } from "../../api/client";

export function InventoryBulkImport() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  function handleFileChange(e) {
    setFile(e.target.files[0] || null);
    setResult(null);
    setError("");
  }

  async function handleImport() {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const res = await productsApi.bulkImport(file);
      setResult(res);
    } catch (err) {
      setError(err.message || "Import failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDownloadTemplate() {
    try {
      await productsApi.downloadImportTemplate();
    } catch (err) {
      setError(err.message || "Could not download template");
    }
  }

  return (
    <div>
      <h1 className="disp text-[26px] font-semibold tracking-tight mb-1">Import products</h1>
      <p className="text-[13.5px] mb-6" style={{ color: "var(--muted)" }}>
        Upload a CSV or Excel file matching the template below. Products with a matching SKU are updated; everything else is created new.
      </p>

      <div className="max-w-[520px] flex flex-col gap-6">
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="flex items-center justify-center gap-2 rounded-md py-2.5 px-4 text-[13.5px] font-medium self-start"
          style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
        >
          <Download size={15} /> Download template
        </button>

        <div className="rounded-lg p-6 text-center" style={{ border: "1px dashed var(--line)" }}>
          <Upload size={28} className="mx-auto mb-3" style={{ color: "var(--muted)" }} />
          <label
            className="px-4 py-2 rounded-md text-[13px] font-medium mb-2 inline-block cursor-pointer"
            style={{ border: "1px solid var(--line)", color: "var(--muted)" }}
          >
            Choose file
            <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFileChange} className="hidden" />
          </label>
          {file && <div className="mono text-[12px] mt-2" style={{ color: "var(--muted)" }}>{file.name}</div>}
        </div>

        {error && (
          <div className="text-[12.5px] px-3 py-2 rounded-md" style={{ background: "rgba(193,85,61,0.15)", color: "var(--rust)" }}>
            {error}
          </div>
        )}

        {result && (
          <div className="flex flex-col gap-4">
            <div className="rounded-lg p-4 grid grid-cols-4 gap-3 text-center" style={{ background: "var(--panel)", border: "1px solid var(--line)" }}>
              <div>
                <div className="mono text-[18px] font-semibold">{result.rows_found}</div>
                <div className="text-[10.5px]" style={{ color: "var(--muted)" }}>Rows found</div>
              </div>
              <div>
                <div className="mono text-[18px] font-semibold" style={{ color: "var(--teal)" }}>{result.created}</div>
                <div className="text-[10.5px]" style={{ color: "var(--muted)" }}>Created</div>
              </div>
              <div>
                <div className="mono text-[18px] font-semibold" style={{ color: "var(--brass)" }}>{result.updated}</div>
                <div className="text-[10.5px]" style={{ color: "var(--muted)" }}>Updated</div>
              </div>
              <div>
                <div className="mono text-[18px] font-semibold" style={{ color: result.errors.length ? "var(--rust)" : "var(--muted)" }}>
                  {result.errors.length}
                </div>
                <div className="text-[10.5px]" style={{ color: "var(--muted)" }}>Errors</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="rounded-lg overflow-hidden" style={{ border: "1px solid var(--line)" }}>
                <div className="px-4 py-2 mono text-[11px]" style={{ background: "var(--panel2)", color: "var(--muted)" }}>ROW ERRORS</div>
                <div className="max-h-[240px] overflow-y-auto">
                  {result.errors.map((e, i) => (
                    <div key={i} className="px-4 py-2 flex items-center justify-between gap-3 text-[12.5px]" style={{ borderTop: "1px solid var(--line)" }}>
                      <span className="mono" style={{ color: "var(--muted)" }}>Row {e.row}</span>
                      <span style={{ color: "var(--rust)" }}>{e.error}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          onClick={handleImport}
          disabled={!file || uploading}
          className="rounded-md py-2.5 text-[14px] font-semibold disp flex items-center justify-center gap-2"
          style={{ background: "var(--brass)", color: "#14171C", opacity: !file || uploading ? 0.6 : 1 }}
        >
          {uploading && <Loader2 size={16} className="spin" />}
          {uploading ? "Importing…" : "Import products"}
        </button>
      </div>
    </div>
  );
}