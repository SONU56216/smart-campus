"use client";

import FileUpload from "@/components/ui/FileUpload";
import { cn } from "@/lib/utils";

interface DocumentStepProps {
  formData: any;
  onChange: (fields: Partial<any>) => void;
  errors: Record<string, string>;
}

export default function DocumentStep({ formData, onChange, errors }: DocumentStepProps) {
  const handlePhotoSelect = (file: File) => {
    // Generate simulated object URL for preview purposes in draft states
    const fileUrl = URL.createObjectURL(file);
    onChange({ 
      photoFile: file, 
      photoUrl: fileUrl 
    });
  };

  const handleIdSelect = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    onChange({ 
      idProofFile: file, 
      idProofUrl: fileUrl 
    });
  };

  return (
    <div className="space-y-4 text-left select-none">
      <div className="border-b border-slate-50 dark:border-slate-900 pb-3">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Step 4: Attach Verification Credentials</h3>
        <p className="text-[10px] text-slate-400 font-medium pt-0.5">
          Scan and upload official documentation files. Maximum file footprint allowed is 5MB.
        </p>
      </div>

      <div className="space-y-4">
        {/* Candidate Photograph Selection */}
        <div className="space-y-1">
          <FileUpload
            label="1. Candidate Profile Photograph"
            accept="image/*"
            maxSizeMB={5}
            value={formData.photoUrl || null}
            onFileSelect={handlePhotoSelect}
          />
          {errors.photoFile && <p className="text-[9px] font-bold text-red-500">{errors.photoFile}</p>}
        </div>

        {/* Identity proof document upload */}
        <div className="space-y-1">
          <FileUpload
            label="2. Government Legal ID Proof (Passport, PAN, National ID)"
            accept="image/*,application/pdf"
            maxSizeMB={5}
            value={formData.idProofUrl || null}
            onFileSelect={handleIdSelect}
          />
          {errors.idProofFile && <p className="text-[9px] font-bold text-red-500">{errors.idProofFile}</p>}
        </div>
      </div>
    </div>
  );
}
