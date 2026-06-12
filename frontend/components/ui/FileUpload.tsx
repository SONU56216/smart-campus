"use client";

import { useState, useRef } from "react";
import { UploadCloud, File, Trash2, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  value?: string | null; // holds uploaded preview url if any
  className?: string;
}

export default function FileUpload({
  onFileSelect,
  accept = "image/*",
  maxSizeMB = 5,
  label = "Upload identification documents",
  value,
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const validateAndProcessFile = (file: File) => {
    const isSizeOk = file.size / 1024 / 1024 <= maxSizeMB;
    if (!isSizeOk) {
      alert(`File is too large! Maximum allowed size is ${maxSizeMB}MB.`);
      return;
    }

    setSelectedFile(file);
    // Simulate uploading progress bar animation
    setIsUploading(true);
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          onFileSelect(file);
          return 100;
        }
        return prev + 20;
      });
    }, 150);
  };

  const removeFile = () => {
    setSelectedFile(null);
    setProgress(0);
    setIsUploading(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full space-y-2", className)}>
      {label && <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide select-none">{label}</label>}
      
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-3 hover:bg-slate-50/50 dark:border-slate-800 dark:hover:bg-slate-900/10",
          dragActive && "border-primary bg-primary/5 dark:border-primary/50 dark:bg-primary/5"
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {value && !selectedFile ? (
          // Value preview if url exists
          <div className="space-y-2 select-none" onClick={(e) => e.stopPropagation()}>
            <img src={value} alt="Attachment Preview" className="w-full max-h-40 object-contain rounded-xl border border-slate-100 shadow-sm" />
            <button
              onClick={() => {
                removeFile();
                inputRef.current?.click();
              }}
              className="text-xs font-semibold text-primary hover:underline"
            >
              Change file description
            </button>
          </div>
        ) : selectedFile ? (
          // Selected file progress detail card
          <div className="w-full space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 dark:border-slate-800">
              <div className="p-2 bg-blue-50 text-primary rounded-lg">
                <File className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{selectedFile.name}</p>
                <p className="text-[10px] text-slate-400">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={removeFile}
                className="p-1 px-[10px] text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Progress indicator bar */}
            {isUploading && (
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span>Uploading documents...</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-200" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {!isUploading && progress === 100 && (
              <div className="flex items-center gap-1 text-emerald-600 text-xs font-semibold select-none">
                <CheckCircle className="w-4 h-4" /> Ready to save
              </div>
            )}
          </div>
        ) : (
          // Default prompt instructions
          <>
            <div className="p-3 bg-slate-50 text-slate-400 dark:bg-slate-905 dark:text-slate-600 rounded-2xl">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div className="space-y-1 select-none">
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Drag and drop or <span className="text-primary hover:underline">browse files</span>
              </p>
              <p className="text-[10px] text-slate-400">
                Supports photos, sign hashes, or PDF templates up to {maxSizeMB}MB
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
