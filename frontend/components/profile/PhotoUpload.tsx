"use client";

import { useState, useRef } from "react";
import { useStudent } from "@/hooks/useStudent";
import { Upload, Camera, FileCheck, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export default function PhotoUpload({ label = "Passport Identity Photo" }: { label?: string }) {
  const { useProfile, useUploadPhoto } = useStudent();
  const { data: student } = useProfile();
  const uploadPhotoMutation = useUploadPhoto();
  
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check type: PNG / JPG / JPEG
    const validTypes = ["image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPEG/PNG files are approved.");
      return;
    }
    // Check size limit: 2MB
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size is too large. Keep under 2MB.");
      return;
    }

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setProgress(15);
    
    // Simulate real upload ticking
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 15;
      });
    }, 120);

    try {
      await uploadPhotoMutation.mutateAsync(selectedFile);
      clearInterval(interval);
      setProgress(100);
      toast.success("Identity Photo synchronized with registrar records!");
      // clear local selections after short delay
      setTimeout(() => {
        setUploading(false);
        setPreviewUrl(null);
        setSelectedFile(null);
        setProgress(0);
      }, 500);
    } catch (_) {
      clearInterval(interval);
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className="bg-slate-900/30 border border-white/5 p-6 rounded-[24px] shadow-xl text-left space-y-4 select-none">
      <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider">
        {label}
      </h3>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        
        {/* Current profile image rendering */}
        <div className="relative group flex-shrink-0">
          <div className="w-24 h-24 rounded-3xl overflow-hidden border-2 border-indigo-500/20 bg-slate-950 p-1 flex items-center justify-center">
            <img 
              src={previewUrl || student?.photo || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces"} 
              alt="Preview photo" 
              className="w-full h-full object-cover rounded-2xl"
            />
          </div>
          {/* hovering camera icon */}
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg border border-indigo-400 shadow cursor-pointer active:scale-95"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Drag and Drop Zone Container */}
        <div 
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`flex-1 w-full border border-dashed rounded-2xl p-5 text-center transition-all flex flex-col items-center justify-center cursor-pointer ${
            dragActive 
              ? "border-indigo-455 bg-indigo-500/10" 
              : "border-slate-800 hover:border-slate-700 bg-white/[0.01]"
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden" 
            accept="image/png, image/jpeg, image/jpg"
          />

          <Upload className="w-6 h-6 text-slate-550 mb-2 leading-none" />
          <p className="text-[11px] font-bold text-slate-300 tracking-wide">
            {selectedFile ? selectedFile.name : "Drag your passportphoto here or click to browse"}
          </p>
          <p className="text-[9px] text-slate-500 font-bold pt-1 uppercase tracking-widest leading-none">
            Approved bounds: JPG/PNG • Limit 2MB
          </p>
        </div>
      </div>

      {/* Upload sequence triggers */}
      {previewUrl && selectedFile && (
        <div className="space-y-3.5 border-t border-white/5 pt-4">
          {uploading ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[9px] font-black text-indigo-400 uppercase">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  uploading payload to secure servers...
                </span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-500 h-1.5 transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-3 pt-0.5">
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="px-3.5 py-2 text-[10px] font-black border border-white/5 hover:bg-white/5 text-slate-400 hover:text-white rounded-xl transition-all uppercase tracking-wider cursor-pointer"
              >
                Reset Selection
              </button>
              
              <button
                type="button"
                onClick={handleUploadSubmit}
                className="px-3.5 py-2 text-[10px] font-black bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 text-white rounded-xl transition-all uppercase tracking-wider shadow-md cursor-pointer"
              >
                Upload Photo File
              </button>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
