import axiosInstance from "../axios";
import { ApiResponse, Student } from "@/types";

export const adminApi = {
  /**
   * Retrieves full student directories matching parameters
   */
  getStudents: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    course?: string;
    cardStatus?: string;
  }): Promise<ApiResponse<{ students: Student[]; pagination: any }>> => {
    const { data } = await axiosInstance.get("/admin/students", { params });
    return data;
  },

  /**
   * View details of any selected student file
   */
  getStudentById: async (id: string): Promise<ApiResponse<{ student: Student }>> => {
    const { data } = await axiosInstance.get(`/admin/students/${id}`);
    return data;
  },

  /**
   * Registers a fresh student index profile
   */
  createStudent: async (payload: any): Promise<ApiResponse<{ student: Student }>> => {
    const { data } = await axiosInstance.post("/admin/students", payload);
    return data;
  },

  /**
   * Modifies critical details like roll numbers, courses or departments
   */
  updateStudent: async (id: string, payload: Partial<Student>): Promise<ApiResponse<{ student: Student }>> => {
    const { data } = await axiosInstance.put(`/admin/students/${id}`, payload);
    return data;
  },

  /**
   * Destroys student records from standard listings
   */
  deleteStudent: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/admin/students/${id}`);
    return data;
  },

  /**
   * Suspends or block cards on security concerns
   */
  toggleCardStatus: async (id: string, cardStatus: Student["cardStatus"]): Promise<ApiResponse<{ student: Student }>> => {
    const { data } = await axiosInstance.post(`/admin/students/${id}/card-status`, { cardStatus });
    return data;
  },

  /**
   * Retrieves global analytical charts and statistics
   */
  getStats: async (): Promise<ApiResponse<{
    totalStudents: number;
    activeCards: number;
    pendingAdmissions: number;
    feeReceptionsSum: number;
    dailyGateEntries: number;
  }>> => {
    const { data } = await axiosInstance.get("/admin/stats");
    return data;
  },

  /**
   * Prints a selected card from backoffice terminals
   */
  printStudentCard: async (id: string): Promise<ApiResponse<{ message: string; printJobId: string }>> => {
    const { data } = await axiosInstance.post(`/admin/students/${id}/print`);
    return data;
  },

  /**
   * Processes batch roster loads via CSV file streams
   */
  bulkImport: async (file: File): Promise<ApiResponse<{ processed: number; failures: any[] }>> => {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await axiosInstance.post("/admin/students/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },

  /**
   * Queries full server logs trail
   */
  getAuditLogs: async (params?: { page?: number; limit?: number; action?: string }): Promise<ApiResponse<any>> => {
    const { data } = await axiosInstance.get("/admin/audit-logs", { params });
    return data;
  },
};
