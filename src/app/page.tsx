"use client";

import FileUpload from "@/components/FileUpload";
import PDFViewer from "@/components/PDFViewer";
import { useState } from "react";
import "../lib/pdf-init";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
  };

  return (
    <main className="min-h-screen  p-8">
      <h1 className="text-xl md:text-3xl font-bold mb-8">
        PDF Coordinate Viewer <br />
        <small className="text-red-700 md:hidden font-bold">
          Note** : Use your Laptop for better performance
        </small>
      </h1>
      {!file ? (
        <FileUpload onFileSelect={handleFileSelect} />
      ) : (
        <PDFViewer file={file} />
      )}
    </main>
  );
}
