import axiosInstance from "../axios";
import { ApiResponse, Student, Notification } from "@/types";

export const studentApi = {
  /**
   * Returns complete profile record of active signed student
   */
  getProfile: async (): Promise<ApiResponse<{ student: Student }>> => {
    const { data } = await axiosInstance.get("/students/me/profile");
    return data;
  },

  /**
   * Modifies demographics like contacts or blood groups
   */
  updateProfile: async (payload: Partial<Student>): Promise<ApiResponse<{ student: Student }>> => {
    const { data } = await axiosInstance.put("/students/me/profile", payload);
    return data;
  },

  /**
   * Upload Profile Photo
   */
  uploadPhoto: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("photo", file);
    const { data } = await axiosInstance.post("/students/me/photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /**
   * Upload Signature Photo
   */
  uploadSignature: async (file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append("signature", file);
    const { data } = await axiosInstance.post("/students/me/signature", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /**
   * Get ID Card printing parameters
   */
  getIdCardData: async (): Promise<ApiResponse<{ idCard: any }>> => {
    const { data } = await axiosInstance.get("/students/me/id-card");
    return data;
  },

  /**
   * Streams PDF format card printout
   */
  downloadIdCardPdf: async (): Promise<ArrayBuffer> => {
    const { data } = await axiosInstance.get("/students/me/id-card/download", {
      responseType: "arraybuffer",
    });
    return data;
  },

  /**
   * Decrypts encrypted barcode strings verifying current cards offline
   */
  getOfflineToken: async (): Promise<ApiResponse<{ qrTokenString: string; expiresAt: string }>> => {
    const { data } = await axiosInstance.get("/students/me/offline-token");
    return data;
  },

  /**
   * Returns list of notification notices
   */
  getNotifications: async (): Promise<ApiResponse<{ notifications: Notification[] }>> => {
    const { data } = await axiosInstance.get("/students/me/notifications");
    return data;
  },

  /**
   * Marks a specific notification node as read
   */
  markAsRead: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post(`/students/me/notifications/${id}/read`);
    return data;
  },

  /**
   * Retrieves past tracking entries log
   */
  getLogs: async (): Promise<ApiResponse<{ logs: any[] }>> => {
    const { data } = await axiosInstance.get("/students/me/logs");
    return data;
  },
};
