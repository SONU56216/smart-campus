import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/payment";
import { toast } from "sonner";

export const usePayment = () => {
  const queryClient = useQueryClient();

  const useCheckoutMutation = () => {
    return useMutation({
      mutationFn: paymentApi.checkout,
      onSuccess: () => {
        toast.info("Payment session initialized on gateway.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Checkout session failed.");
      },
    });
  };

  const useConfirmMutation = () => {
    return useMutation({
      mutationFn: paymentApi.confirm,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-payment-history"] });
        toast.success("Transaction resolved successfully!");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to finalize digital transaction.");
      },
    });
  };

  const downloadReceiptPdf = async (id: string, txnId: string) => {
    try {
      toast.loading("Processing thermal point-of-sale receipt...");
      const buffer = await paymentApi.downloadReceipt(id);
      
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `receipt_${txnId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Certified PDF payment receipt downloaded.");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to load receipt PDF.");
    }
  };

  const useHistoryQuery = (filters?: any) => {
    return useQuery({
      queryKey: ["my-payment-history", filters],
      queryFn: async () => {
        const res = await paymentApi.getHistory(filters);
        return res.data.payments;
      },
    });
  };

  const useRequestRefundMutation = () => {
    return useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) => 
        paymentApi.requestRefund(id, reason),
      onSuccess: (res) => {
        toast.success(res.message || "Dispute claim registered with audits.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Refund registration sequence failed.");
      },
    });
  };

  // ==========================================
  // TREASURY STAFF ACTIONS
  // ==========================================

  const useAllPaymentsQuery = (filters?: any) => {
    return useQuery({
      queryKey: ["admin-payments-ledger", filters],
      queryFn: async () => {
        const res = await paymentApi.getAllPayments(filters);
        return res.data;
      },
    });
  };

  const usePendingQuery = () => {
    return useQuery({
      queryKey: ["admin-pending-transactions"],
      queryFn: async () => {
        const res = await paymentApi.getPending();
        return res.data.payments;
      },
    });
  };

  const useReconcileMutation = () => {
    return useMutation({
      mutationFn: paymentApi.reconcile,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-payments-ledger"] });
        queryClient.invalidateQueries({ queryKey: ["admin-pending-transactions"] });
        toast.success("Reconciliation processed successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Reconciliation failed.");
      },
    });
  };

  const useBypassOverrideMutation = () => {
    return useMutation({
      mutationFn: ({ id, reason }: { id: string; reason: string }) => 
        paymentApi.bypassGatewayOverride(id, reason),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-payments-ledger"] });
        queryClient.invalidateQueries({ queryKey: ["admin-pending-transactions"] });
        toast.success("Administrative gateway waiver manual bypass verified.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Bypass override rejected.");
      },
    });
  };

  const useRevenueReportQuery = () => {
    return useQuery({
      queryKey: ["admin-revenue-reporting-analytics"],
      queryFn: async () => {
        const res = await paymentApi.getRevenueReport();
        return res.data;
      },
    });
  };

  return {
    useCheckout: useCheckoutMutation,
    useConfirm: useConfirmMutation,
    downloadReceiptPdf,
    useHistory: useHistoryQuery,
    useRequestRefund: useRequestRefundMutation,
    
    // Treasury staff
    useAllPayments: useAllPaymentsQuery,
    usePending: usePendingQuery,
    useReconcile: useReconcileMutation,
    useBypassOverride: useBypassOverrideMutation,
    useRevenueReport: useRevenueReportQuery,
  };
};
