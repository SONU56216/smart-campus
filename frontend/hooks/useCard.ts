import { useQuery } from "@tanstack/react-query";
import { studentApi } from "@/lib/api/student";
import { toast } from "sonner";

export const useCard = () => {
  /**
   * Reads structural parameters required to render physical / virtual ID cards
   */
  const useIdCardData = () => {
    return useQuery({
      queryKey: ["id-card-data"],
      queryFn: async () => {
        const res = await studentApi.getIdCardData();
        return res.data.idCard;
      },
      retry: 1,
    });
  };

  /**
   * Fetches the dynamic secure QR decryption token (refreshed periodically)
   */
  const useOfflineToken = (enabled: boolean = false) => {
    return useQuery({
      queryKey: ["offline-token-rotating"],
      queryFn: async () => {
        const res = await studentApi.getOfflineToken();
        return res.data;
      },
      refetchInterval: 30000, // Rotating decryption token updates every 30 seconds
      enabled,
    });
  };

  /**
   * Helper utility triggers client download streams containing signed certified printable files
   */
  const downloadCardPdf = async (fullName: string) => {
    try {
      toast.loading("Generating certified PDF ID card...");
      const buffer = await studentApi.downloadIdCardPdf();
      
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `campuspass_id_card_${fullName.replace(/\s+/g, "_").toLowerCase()}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("ID Card generated and downloaded successfully.");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to download your PDF credentials.");
    }
  };

  return {
    useIdCardData,
    useOfflineToken,
    downloadCardPdf,
  };
};
