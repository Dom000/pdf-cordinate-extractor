"use client";

import { Trash2 } from "lucide-react";
import { SavedEntry } from "../../types";

interface SavedPointsPanelProps {
  entries: SavedEntry[];
  onRemove: (id: string) => void;
  onClear: () => void;
}

function toCSV(entries: SavedEntry[]): string {
  const header = "kind,page,x,y,width,height";
  const rows = entries.map((entry) =>
    entry.kind === "point"
      ? `point,${entry.page},${entry.x},${entry.y},,`
      : `rect,${entry.page},${entry.x},${entry.y},${entry.width},${entry.height}`
  );
  return [header, ...rows].join("\n");
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function SavedPointsPanel({
  entries,
  onRemove,
  onClear,
}: SavedPointsPanelProps) {
  if (entries.length === 0) return null;

  return (
    <div className="mt-10 w-full max-w-2xl rounded-2xl border-4 border-ink bg-white p-5 shadow-hard-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl font-semibold text-ink">
          Saved points &amp; rectangles{" "}
          <span className="text-ink/40">({entries.length})</span>
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() =>
              downloadFile(
                "coordinates.json",
                JSON.stringify(entries, null, 2),
                "application/json"
              )
            }
            className="rounded-lg border-2 border-ink bg-teal/20 px-3 py-1 text-sm font-medium text-ink hover:bg-teal/30"
          >
            Export JSON
          </button>
          <button
            onClick={() =>
              downloadFile("coordinates.csv", toCSV(entries), "text/csv")
            }
            className="rounded-lg border-2 border-ink bg-teal/20 px-3 py-1 text-sm font-medium text-ink hover:bg-teal/30"
          >
            Export CSV
          </button>
          <button
            onClick={onClear}
            className="rounded-lg border-2 border-ink bg-coral/20 px-3 py-1 text-sm font-medium text-ink hover:bg-coral/30"
          >
            Clear all
          </button>
        </div>
      </div>
      <div className="max-h-64 overflow-y-auto rounded-xl border-2 border-ink/20">
        <table className="w-full font-data text-sm">
          <thead className="sticky top-0 bg-paper">
            <tr>
              <th className="p-2 text-left">#</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Page</th>
              <th className="p-2 text-left">X (pt)</th>
              <th className="p-2 text-left">Y (pt)</th>
              <th className="p-2 text-left">W (pt)</th>
              <th className="p-2 text-left">H (pt)</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, i) => (
              <tr key={entry.id} className="border-t border-ink/10">
                <td className="p-2">{i + 1}</td>
                <td className="p-2 capitalize">{entry.kind}</td>
                <td className="p-2">{entry.page}</td>
                <td className="p-2">{Math.round(entry.x)}</td>
                <td className="p-2">{Math.round(entry.y)}</td>
                <td className="p-2">
                  {entry.kind === "rect" ? Math.round(entry.width) : "—"}
                </td>
                <td className="p-2">
                  {entry.kind === "rect" ? Math.round(entry.height) : "—"}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => onRemove(entry.id)}
                    aria-label="Remove"
                    className="text-coral hover:text-coral/70"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 font-data text-xs text-ink/50">
        Rectangles use the pdf-lib convention: (x, y) is the bottom-left
        corner, in PDF points.
      </p>
    </div>
  );
}
