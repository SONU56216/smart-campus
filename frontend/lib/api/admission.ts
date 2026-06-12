import axiosInstance from "../axios";
import { ApiResponse, AdmissionApplication, PaginatedResponse } from "@/types";

export const admissionApi = {
  // ==========================================
  // CANDIDATE / STUDENT PIPELINES
  // ==========================================
  
  /**
   * Send validated multi-step admission application
   */
  submitApplication: async (payload: any): Promise<ApiResponse<{ application: AdmissionApplication }>> => {
    const { data } = await axiosInstance.post("/admissions/apply", payload);
    return data;
  },

  /**
   * Returns current application registry of logged candidate
   */
  getMyApplications: async (): Promise<ApiResponse<{ applications: AdmissionApplication[] }>> => {
    const { data } = await axiosInstance.get("/admissions/my-applications");
    return data;
  },

  /**
   * Detail check of specific application
   */
  getApplicationStatus: async (id: string): Promise<ApiResponse<{ application: AdmissionApplication }>> => {
    const { data } = await axiosInstance.get(`/admissions/my-applications/${id}`);
    return data;
  },

  /**
   * Amends demographic or contact information before final validations
   */
  updateApplication: async (id: string, payload: any): Promise<ApiResponse<{ application: AdmissionApplication }>> => {
    const { data } = await axiosInstance.put(`/admissions/my-applications/${id}`, payload);
    return data;
  },

  /**
   * Resolves application evaluation dues
   */
  payApplicationFee: async (id: string, paymentGateway: string): Promise<ApiResponse<any>> => {
    const { data } = await axiosInstance.post(`/admissions/my-applications/${id}/pay`, { paymentGateway });
    return data;
  },

  /**
   * Streams PDF formatted offer letters direct to student browser
   */
  downloadAdmissionLetter: async (id: string): Promise<ArrayBuffer> => {
    const { data } = await axiosInstance.get(`/admissions/my-applications/${id}/admission-letter`, {
      responseType: "arraybuffer",
    });
    return data;
  },

  /**
   * Public course merit listings search
   */
  getPublicMeritList: async (course: string): Promise<ApiResponse<{ meritList: any[] }>> => {
    const { data } = await axiosInstance.get("/admissions/merit-list", { params: { course } });
    return data;
  },

  // ==========================================
  // OFFICE STAFF / ADMINISTRATOR EXCLUSIVE SERVICES
  // ==========================================

  /**
   * List global registers
   */
  getAllApplications: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    course?: string;
    search?: string;
  }): Promise<PaginatedResponse<AdmissionApplication>> => {
    const { data } = await axiosInstance.get("/admissions/admin/applications", { params });
    return data;
  },

  /**
   * View details of candidate registration
   */
  getApplicationById: async (id: string): Promise<ApiResponse<{ application: AdmissionApplication }>> => {
    const { data } = await axiosInstance.get(`/admissions/admin/applications/${id}`);
    return data;
  },

  /**
   * Confirms academic file approvals
   */
  approveApplication: async (id: string, remarks?: string): Promise<ApiResponse<{ application: AdmissionApplication }>> => {
    const { data } = await axiosInstance.post(`/admissions/admin/applications/${id}/approve`, { remarks });
    return data;
  },

  /**
   * Dismisses application specifying reason remarks
   */
  rejectApplication: async (id: string, remarks: string): Promise<ApiResponse<{ application: AdmissionApplication }>> => {
    const { data } = await axiosInstance.post(`/admissions/admin/applications/${id}/reject`, { remarks });
    return data;
  },

  /**
   * Fast batch approvals checklist
   */
  bulkApprove: async (ids: string[], remarks?: string): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await axiosInstance.post("/admissions/admin/applications/bulk-approve", { ids, remarks });
    return data;
  },

  /**
   * Batch email offer notice letters
   */
  sendOfferLetters: async (ids: string[]): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await axiosInstance.post("/admissions/admin/applications/send-offers", { ids });
    return data;
  },

  /**
   * Triggers background weighting hierarchy ranking computations
   */
  generateMeritList: async (course: string): Promise<ApiResponse<{ meritList: any[] }>> => {
    const { data } = await axiosInstance.get("/admissions/admin/merit-list", { params: { course } });
    return data;
  },
};
