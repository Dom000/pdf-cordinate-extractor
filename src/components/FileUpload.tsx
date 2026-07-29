"use client";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";
import Crosshair from "./Crosshair";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export default function FileUpload({ onFileSelect }: FileUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`flex cursor-pointer flex-col items-center gap-4 rounded-3xl border-4 border-dashed p-16 text-center transition-colors ${
        isDragActive
          ? "border-coral bg-coral/10"
          : "border-ink/30 bg-white hover:border-ink/60"
      }`}
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <Crosshair className="h-16 w-16 animate-wobble text-coral" />
      ) : (
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-4 border-ink bg-amber shadow-hard-sm">
          <Upload size={28} strokeWidth={2.5} className="text-ink" />
        </span>
      )}
      <p className="font-display text-xl font-semibold text-ink">
        {isDragActive ? "Drop it right here" : "Drag and drop a PDF"}
      </p>
      <p className="text-ink/60">
        or <span className="underline decoration-2 underline-offset-2">click to choose a file</span>
      </p>
    </div>
  );
}
