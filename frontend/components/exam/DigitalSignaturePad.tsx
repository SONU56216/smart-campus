"use client";

import { useEffect, useRef, useState } from "react";
import { RotateCcw, Trash2, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface DigitalSignaturePadProps {
  onChange: (base64: string) => void;
  savedSignature?: string;
}

export default function DigitalSignaturePad({ onChange, savedSignature }: DigitalSignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas high-DPI scaling
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = "#60a5fa"; // Indigo-blue signature ink
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    // Draw pre-saved signature if available
    if (savedSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
      };
      img.src = savedSignature;
    }
  }, [savedSignature]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setHistory((prev) => [...prev, canvas.toDataURL()]);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
    saveToHistory();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      const canvas = canvasRef.current;
      if (canvas) {
        onChange(canvas.toDataURL());
      }
    }
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);
    setHistory([]);
    onChange("");
    toast.success("Signature pad cleared.");
  };

  const handleUndo = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || history.length === 0) return;

    const previousHistory = [...history];
    const undoneState = previousHistory.pop();
    setHistory(previousHistory);

    ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

    if (previousHistory.length > 0) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width / 2, canvas.height / 2);
        onChange(canvas.toDataURL());
      };
      img.src = previousHistory[previousHistory.length - 1];
    } else {
      onChange("");
    }
  };

  return (
    <div className="space-y-3 select-none text-left">
      <div className="flex justify-between items-center pl-1">
        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1.5 matches-label">
          <Edit3 className="w-3.5 h-3.5 text-blue-400" />
          Ink Authorized Digital Signature *
        </label>
        <span className="text-[9px] text-slate-550 uppercase font-bold">
          Sign inside box with stylus or finger
        </span>
      </div>

      <div className="relative border border-slate-800 focus-within:border-blue-500/50 bg-slate-900/30 rounded-2xl overflow-hidden hover:border-slate-700 transition-all">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="w-full h-44 cursor-crosshair block touch-none"
        />

        {/* Action Controls row within the canvas box */}
        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleUndo}
              className="p-2 py-1.5 text-[10px] font-black uppercase text-slate-400 hover:text-white bg-slate-950/80 hover:bg-slate-950 border border-white/5 hover:border-slate-800 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Undo
            </button>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="p-2 py-1.5 text-[10px] font-black uppercase text-red-400 hover:text-red-300 bg-slate-950/80 hover:bg-slate-950 border border-white/5 hover:border-red-500/20 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
}
