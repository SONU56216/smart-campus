import axiosInstance from "../axios";
import { ApiResponse, Payment, PaginatedResponse } from "@/types";

export const paymentApi = {
  // ==========================================
  // STUDENT SERVICES
  // ==========================================

  /**
   * Initializes order checkout payload
   */
  checkout: async (payload: {
    amount: number;
    purpose: string;
    paymentGateway: string;
    admissionApplicationId?: string;
    examFormId?: string;
  }): Promise<ApiResponse<{ orderId: string; amountNum: number; currency: string; transactionId: string }>> => {
    const { data } = await axiosInstance.post("/payments/checkout", payload);
    return data;
  },

  /**
   * Confirms payment signature receipt status
   */
  confirm: async (payload: {
    transactionId: string;
    gatewayTransactionId?: string;
    isSuccess: boolean;
  }): Promise<ApiResponse<{ payment: Payment }>> => {
    const { data } = await axiosInstance.post("/payments/confirm", payload);
    return data;
  },

  /**
   * Streams PDF receipt format direct to client
   */
  downloadReceipt: async (id: string): Promise<ArrayBuffer> => {
    const { data } = await axiosInstance.get(`/payments/receipt/${id}`, {
      responseType: "arraybuffer",
    });
    return data;
  },

  /**
   * Returns chronological payments registries of signed user
   */
  getHistory: async (params?: { status?: string; purpose?: string }): Promise<ApiResponse<{ payments: Payment[] }>> => {
    const { data } = await axiosInstance.get("/payments/history", { params });
    return data;
  },

  /**
   * Lodges formally double debits or failed payments refund requests
   */
  requestRefund: async (id: string, reason: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post(`/payments/refund/${id}`, { reason });
    return data;
  },

  // ==========================================
  // FINANCE OFFICE EXCLUSIVE METHODS
  // ==========================================

  /**
   * Returns whole database fee registers paginated matching filters
   */
  getAllPayments: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    purpose?: string;
    search?: string;
  }): Promise<PaginatedResponse<Payment>> => {
    const { data } = await axiosInstance.get("/payments/admin/transactions", { params });
    return data;
  },

  /**
   * Filters ledger transactions awaiting reconciliation checks
   */
  getPending: async (): Promise<ApiResponse<{ payments: Payment[] }>> => {
    const { data } = await axiosInstance.get("/payments/admin/pending");
    return data;
  },

  /**
   * Manually reconciles payment node verification signatures
   */
  reconcile: async (id: string): Promise<ApiResponse<{ payment: Payment }>> => {
    const { data } = await axiosInstance.post(`/payments/admin/reconcile/${id}`);
    return data;
  },

  /**
   * Grants administrative bypass waivers or marks offline cash collections
   */
  bypassGatewayOverride: async (id: string, reason: string): Promise<ApiResponse<{ payment: Payment }>> => {
    const { data } = await axiosInstance.post(`/payments/admin/override/${id}`, { reason });
    return data;
  },

  /**
   * Aggregates financial analytics charts and logs
   */
  getRevenueReport: async (): Promise<ApiResponse<{
    totalRevenueCollected: number;
    categories: Array<{ purpose: string; _sum: { amount: number }; _count: { id: number } }>;
    gatewayBreakdown: Array<{ paymentGateway: string; _count: { id: number } }>;
  }>> => {
    const { data } = await axiosInstance.get("/payments/admin/reporting");
    return data;
  },

  /**
   * Generates a downloadable CSV download stream
   */
  exportSpreadsheetUrl: (): string => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";
    return `${axiosInstance.defaults.baseURL}/payments/admin/export?token=${token}`;
  },
};
