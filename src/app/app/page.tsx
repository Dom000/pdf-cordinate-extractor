"use client";

import Link from "next/link";
import FileUpload from "@/components/FileUpload";
import PDFViewer from "@/components/PDFViewer";
import Crosshair from "@/components/Crosshair";
import { useState } from "react";
import "../../lib/pdf-init";

export default function AppPage() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <main className="min-h-screen px-6 pb-16 pt-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-display text-lg font-semibold text-ink"
          >
            <Crosshair className="h-6 w-6 text-coral" />
            X marks the spot
          </Link>
          {file && (
            <button
              onClick={() => setFile(null)}
              className="rounded-xl border-4 border-ink bg-white px-4 py-1.5 text-sm font-medium text-ink shadow-hard-sm transition-transform hover:-translate-y-0.5 active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
            >
              New file
            </button>
          )}
        </div>

        <h1 className="mt-8 font-display text-2xl font-semibold text-ink md:text-3xl">
          PDF coordinate viewer
          <br />
          <small className="font-body text-sm font-medium text-coral md:hidden">
            Note: use a laptop for better performance
          </small>
        </h1>

        <div className="mt-8">
          {!file ? (
            <FileUpload onFileSelect={setFile} />
          ) : (
            <PDFViewer file={file} />
          )}
        </div>
      </div>
    </main>
  );
}
