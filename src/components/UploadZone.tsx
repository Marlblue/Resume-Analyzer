"use client";

import { useState, useRef, type DragEvent, type ChangeEvent } from "react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

/** Maximum file size: 5MB */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isValidFile = (file: File): string | null => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.type)) {
      return "Format tidak didukung. Gunakan PDF atau DOCX.";
    }
    if (file.size > MAX_FILE_SIZE) {
      return "Ukuran file terlalu besar. Maksimal 5MB.";
    }
    return null;
  };

  const processFile = (file: File) => {
    const validationError = isValidFile(file);
    if (validationError) {
      setError(validationError);
      setFileName(null);
      return;
    }
    setError(null);
    setFileName(file.name);
    onFileSelect(file);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };

  const handleDragOut = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
    // Reset value so the same file can be re-selected
    e.target.value = "";
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div
      className={`upload-zone ${dragOver ? "drag-over" : ""}`}
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? "none" : "auto" }}
      id="upload-zone"
      role="button"
      tabIndex={0}
      aria-label="Upload resume file"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx"
        onChange={handleChange}
        disabled={disabled}
        id="file-input"
        style={{ display: "none" }}
      />
      {error ? (
        <>
          <p className="upload-zone-label text-error">{error}</p>
          <p className="upload-zone-hint">Klik atau drop file untuk coba lagi</p>
        </>
      ) : fileName ? (
        <>
          <p className="upload-zone-label">{fileName}</p>
          <p className="upload-zone-hint">Klik atau drop untuk ganti file</p>
        </>
      ) : (
        <>
          <p className="upload-zone-label">Drop resume di sini</p>
          <p className="upload-zone-hint">PDF atau DOCX · Maks 5MB</p>
        </>
      )}
      <div style={{ marginTop: "1.5rem" }}>
        <p className="upload-zone-hint" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontSize: "0.7rem", opacity: 0.8 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          100% Aman & Privat. File tidak disimpan di server.
        </p>
      </div>
    </div>
  );
}

