"use client";

import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";
import { cn } from "@/lib/utils";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "primary";
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Verify Action?",
  description = "Are you sure you wish to trigger this verification parameter? This might be irreversible.",
  confirmText = "Proceed Confirm",
  cancelText = "Discard",
  variant = "primary",
}: ConfirmDialogProps) {
  const confirmButtonClasses = {
    primary: "bg-primary hover:bg-primary-dark text-white focus:ring-primary",
    warning: "bg-warning hover:bg-amber-600 text-white focus:ring-warning",
    danger: "bg-danger hover:bg-red-700 text-white focus:ring-danger",
  };

  const iconColors = {
    primary: "bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-500",
    warning: "bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-500",
    danger: "bg-red-100 text-red-600 dark:bg-red-950/40 dark:text-red-500",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center space-y-4">
        {/* Banner Alert Icon */}
        <div className={cn("p-3 rounded-full", iconColors[variant])}>
          <AlertTriangle className="w-8 h-8" />
        </div>

        {/* Messaging descriptors */}
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h4>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        </div>

        {/* Dialogue Controller Action Buttons */}
        <div className="flex items-center gap-3 w-full pt-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-all shadow-sm dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900 dark:text-slate-300"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium rounded-xl transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-95 text-center",
              confirmButtonClasses[variant]
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
