"use client";

import { useAdmissionStore } from "@/hooks/useAdmissionStore";
import { Upload, FileCheck, Trash2, ArrowLeft, Image as ImageIcon, FileText, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface StepProps {
  onNext: () => void;
  onPrev: () => void;
}

interface UploadKey {
  field: "photo" | "signature" | "class10Marksheet" | "class12Marksheet" | "idProof";
  label: string;
  accept: string;
  progressKey: "photoProgress" | "signatureProgress" | "class10Progress" | "class12Progress" | "idProgress";
}

export default function DocumentUploadStep({ onNext, onPrev }: StepProps) {
  const { documents, setDocuments, markStepComplete } = useAdmissionStore();
  const [activeDrag, setActiveDrag] = useState<string | null>(null);

  const documentSlots: UploadKey[] = [
    { field: "photo", label: "Candidate Passport Photograph", accept: "image/*", progressKey: "photoProgress" },
    { field: "signature", label: "Digital Ink Signature Specimen", accept: "image/*", progressKey: "signatureProgress" },
    { field: "class10Marksheet", label: "Class 10 Certified Marksheet Transcript", accept: "image/*,application/pdf", progressKey: "class10Progress" },
    { field: "class12Marksheet", label: "Class 12 / Intermediate transcript PDF", accept: "image/*,application/pdf", progressKey: "class12Progress" },
    { field: "idProof", label: "Official Identity Card Proof (Govt ID)", accept: "image/*,application/pdf", progressKey: "idProgress" }
  ];

  const handleFileReader = (file: File, slot: UploadKey) => {
    // 5MB limit validation
    if (file.size > 5 * 1024 * 1024) {
      toast.error(`${slot.label} exceeds 5MB size ceiling limit.`);
      return;
    }

    const reader = new FileReader();
    
    // Simulate interactive micro progress upload
    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setDocuments({ [slot.progressKey]: progress });
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 150);

    reader.onload = (e) => {
      const base64Str = e.target?.result as string;
      setDocuments({ 
        [slot.field]: base64Str,
        [slot.progressKey]: 100
      });
      toast.success(`${slot.label} resolved and saved locally.`);
    };

    reader.onerror = () => {
      clearInterval(interval);
      toast.error(`Error loading file: ${slot.label}`);
    };

    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, slot: UploadKey) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileReader(file, slot);
    }
  };

  const handleDragOver = (e: React.DragEvent, field: string) => {
    e.preventDefault();
    setActiveDrag(field);
  };

  const handleDragLeave = () => {
    setActiveDrag(null);
  };

  const handleDrop = (e: React.DragEvent, slot: UploadKey) => {
    e.preventDefault();
    setActiveDrag(null);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileReader(file, slot);
    }
  };

  const handleRemove = (slot: UploadKey) => {
    setDocuments({ 
      [slot.field]: "",
      [slot.progressKey]: 0 
    });
    toast.info(`Removed ${slot.label}. Please re-upload dynamic files.`);
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verification checkpoints
    const missingDocs = documentSlots.filter((slot) => !documents[slot.field]);
    if (missingDocs.length > 0) {
      toast.error(`Please upload all 5 required academic documents details. Missing: ${missingDocs.map(d => d.label).join(", ")}`);
      return;
    }

    markStepComplete(3, true);
    onNext();
  };

  return (
    <form onSubmit={handleNext} className="space-y-6 select-none text-left">
      
      <div className="bg-slate-900/40 border border-white/5 p-6 rounded-[24px] space-y-6 shadow-xl">
        
        {/* Step Header */}
        <div className="border-b border-white/5 pb-3">
          <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Upload className="w-4.5 h-4.5 text-blue-400" />
            PART 4: Document Verification Desk
          </h3>
          <p className="text-[10px] text-slate-500 font-bold uppercase pt-0.5">
            Submit copy certifications. Format allowed: JPG, PNG, PDF. Max Size: 5MB per block.
          </p>
        </div>

        {/* Upload grids spacer */}
        <div className="space-y-4">
          
          {documentSlots.map((slot) => {
            const uploadedData = documents[slot.field];
            const currentProgress = documents[slot.progressKey] || 0;
            const isDragActive = activeDrag === slot.field;
            
            return (
              <div 
                key={slot.field} 
                className="bg-white/[0.01] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Visual Label */}
                <div className="md:max-w-xs space-y-1">
                  <span className="text-[10px] font-black text-slate-300 uppercase block tracking-wider leading-none">
                    {slot.label} *
                  </span>
                  <span className="text-[8px] font-bold text-slate-550 block uppercase tracking-wide">
                    {slot.accept.includes("pdf") ? "Standard Document (Max 5MB)" : "Identity Face Print/Signature (Max 5MB)"}
                  </span>
                </div>

                {/* Upload drag drop zone */}
                <div className="flex-1 max-w-lg">
                  {!uploadedData ? (
                    <div
                      onDragOver={(e) => handleDragOver(e, slot.field)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, slot)}
                      className={`h-24 rounded-xl border border-dashed flex flex-col items-center justify-center p-3 transition-all relative cursor-pointer ${
                        isDragActive 
                          ? "bg-blue-650/10 border-blue-500" 
                          : "bg-slate-950 border-slate-800 hover:border-slate-700"
                      }`}
                    >
                      <input
                        type="file"
                        accept={slot.accept}
                        onChange={(e) => handleFileInputChange(e, slot)}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      
                      {currentProgress > 0 && currentProgress < 100 ? (
                        <div className="w-full max-w-[180px] space-y-1.5 text-center">
                          <span className="text-[9px] font-black tracking-widest text-blue-400 block uppercase animate-pulse">
                            READING FILE {currentProgress}%
                          </span>
                          <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                            <div className="bg-blue-500 h-full transition-all duration-150" style={{ width: `${currentProgress}%` }} />
                          </div>
                        </div>
                      ) : (
                        <div className="text-center space-y-1">
                          <div className="flex justify-center text-slate-505 text-slate-500">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-[9.5px] font-black text-blue-400 uppercase tracking-widest block leading-none">
                            Drag & Drop file
                          </span>
                          <span className="text-[8px] font-bold text-slate-550 block uppercase">
                            or click manually to choose folder
                          </span>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Show Preview and clear keys */
                    <div className="h-24 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between px-4">
                      <div className="flex items-center gap-3">
                        {uploadedData.startsWith("data:image") ? (
                          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center">
                            <img src={uploadedData} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-405 flex items-center justify-center">
                            <FileText className="w-6 h-6" />
                          </div>
                        )}
                        
                        <div className="leading-none text-left space-y-1">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[8px] font-black bg-emerald-500/10 text-emerald-400 uppercase">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            Ready
                          </span>
                          <p className="text-[9px] font-mono font-bold text-slate-500 uppercase select-all max-w-[140px] truncate leading-none">
                            {uploadedData.substring(0, 30)}...
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemove(slot)}
                        className="p-2 bg-red-500/10 hover:bg-red-550/20 border border-transparent hover:border-red-500/30 text-red-400 rounded-xl transition-all cursor-pointer"
                        title="Remove Document"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

              </div>
            );
          })}

        </div>

      </div>

      {/* Button Controls */}
      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center gap-2 px-5 py-3.5 text-xs font-black bg-white/5 hover:bg-white/10 border border-white/5 text-slate-350 rounded-xl transition-all cursor-pointer uppercase tracking-wider leading-none"
        >
          <ArrowLeft className="w-4 h-4" />
          Previous Step
        </button>
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3.5 text-xs font-black bg-blue-600 hover:bg-blue-500 border border-blue-500 text-white rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider leading-none pt-[15px]"
        >
          Confirm and Proceed Next Step
        </button>
      </div>

    </form>
  );
}
