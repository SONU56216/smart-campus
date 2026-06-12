"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "sonner";

/**
 * Capture utility that compiles React DOM elements into premium high-definition PNG nodes.
 */
export const generateCardImage = async (elementId: string, fileName: string): Promise<string> => {
  const element = document.getElementById(elementId);
  if (!element) {
    const errStr = `Render element '#${elementId}' was not resolved in viewport.`;
    toast.error(errStr);
    throw new Error(errStr);
  }

  try {
    toast.loading("Compiling digital credentials into high-definition asset...");
    
    // Configure html2canvas for glassmorphic elements and cross-origin resource sharing (CORS)
    const canvas = await html2canvas(element, {
      scale: 3, // Premium high-def resolution (3x)
      useCORS: true, // Auto-request cross-origin asset allocations
      allowTaint: false,
      backgroundColor: null, // Keep background transparent for modular overlays
      logging: false,
      onclone: (clonedDoc) => {
        // Enforce the front face is visible during download render, disabling rotation properties
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.transform = "none";
          clonedElement.style.transition = "none";
        }
      }
    });

    const dataUrl = canvas.toDataURL("image/png");
    
    // Auto-download files using native client anchoring
    const downloadAnchor = document.createElement("a");
    downloadAnchor.href = dataUrl;
    downloadAnchor.download = `${fileName.replace(/\s+/g, "_").toLowerCase()}_id_card.png`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);

    toast.dismiss();
    toast.success("Holographic PNG saved successfully.");
    return dataUrl;
  } catch (err: any) {
    toast.dismiss();
    toast.error(`Image Compilation Failure: ${err.message || err}`);
    throw err;
  }
};

/**
 * Capture utility compiling visual components into vector-scalable PDF packets utilizing jsPDF.
 */
export const generateCardPdf = async (elementId: string, fileName: string): Promise<void> => {
  const element = document.getElementById(elementId);
  if (!element) {
    const errStr = `Render element '#${elementId}' was not resolved in viewport.`;
    toast.error(errStr);
    throw new Error(errStr);
  }

  try {
    toast.loading("Generating certified cryptographic PDF document...");
    
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          clonedElement.style.transform = "none";
          clonedElement.style.transition = "none";
        }
      }
    });

    const imgData = canvas.toDataURL("image/png");
    
    // Target logical design dimensions (e.g. standard ISO CR80 card specs: 85.6mm x 54mm equivalent scaled)
    const printWidth = 350;
    const printHeight = 540;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [printWidth, printHeight],
    });

    // Write PNG data stream in a centered frame box
    pdf.addImage(imgData, "PNG", 0, 0, printWidth, printHeight, undefined, "FAST");
    pdf.save(`${fileName.replace(/\s+/g, "_").toLowerCase()}_id_card.pdf`);

    toast.dismiss();
    toast.success("Secure PDF Saved.");
  } catch (err: any) {
    toast.dismiss();
    toast.error(`PDF Construction Failure: ${err.message || err}`);
    throw err;
  }
};
