import axiosInstance from "../axios";
import { ApiResponse, Attendance } from "@/types";

export const attendanceApi = {
  /**
   * Scans cryptographic dynamic barcodes or coordinates marking present checks
   */
  markAttendance: async (payload: { qrTokenString: string; locationLatitude?: number; locationLongitude?: number }): Promise<ApiResponse<{ attendance: Attendance }>> => {
    const { data } = await axiosInstance.post("/attendance/scan-mark", payload);
    return data;
  },

  /**
   * Verifies hardware gateway scans (usually utilized by hardware controllers)
   */
  hardwareSwipeNFC: async (payload: { rfidCardUid: string; readerGateIP: string }): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post("/attendance/hardware/swipe", payload);
    return data;
  },

  /**
   * Reads student tracking registries histories
   */
  getMyAttendance: async (params?: { startDate?: string; endDate?: string }): Promise<ApiResponse<{ attendance: Attendance[]; totalSessions: number; presentSessions: number; percentage: number }>> => {
    const { data } = await axiosInstance.get("/attendance/my-attendance", { params });
    return data;
  },

  // ==========================================
  // ATTENDANCE DEPT SERVICES
  // ==========================================

  /**
   * Reads live gate monitoring stats today
   */
  getToday: async (): Promise<ApiResponse<{ liveRoll: Attendance[]; totalScansCount: number }>> => {
    const { data } = await axiosInstance.get("/attendance/admin/today");
    return data;
  },

  /**
   * Retrieves whole directories paginated
   */
  getRegister: async (params?: {
    page?: number;
    limit?: number;
    studentId?: string;
    course?: string;
    date?: string;
  }): Promise<ApiResponse<{ register: Attendance[]; pagination: any }>> => {
    const { data } = await axiosInstance.get("/attendance/admin/register", { params });
    return data;
  },

  /**
   * Overrides manual checkin/checkout statuses
   */
  updateRecord: async (id: string, payload: { status: "PRESENT" | "ABSENT" | "LEAVE"; remarks?: string }): Promise<ApiResponse<{ attendance: Attendance }>> => {
    const { data } = await axiosInstance.put(`/attendance/admin/register/${id}`, payload);
    return data;
  },

  /**
   * Fast batch marking grids
   */
  bulkMark: async (payload: { date: string; studentIds: string[]; status: string; course: string }): Promise<ApiResponse<{ processed: number }>> => {
    const { data } = await axiosInstance.post("/attendance/admin/bulk", payload);
    return data;
  },

  /**
   * Generates custom reports
   */
  getReport: async (params: { course: string; semester: number; month?: number }): Promise<ApiResponse<{ report: any[] }>> => {
    const { data } = await axiosInstance.get("/attendance/admin/report", { params });
    return data;
  },

  /**
   * Dispatches alerts warnings to cohorts below 75% thresholds
   */
  notifyShortage: async (payload: { course: string; semester: number }): Promise<ApiResponse<{ sentEmailAlertsCount: number }>> => {
    const { data } = await axiosInstance.post("/attendance/admin/low-alerts", payload);
    return data;
  },
};
