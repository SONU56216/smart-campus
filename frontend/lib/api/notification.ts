import axiosInstance from "../axios";
import { ApiResponse, Notification } from "@/types";

export const notificationApi = {
  /**
   * Drops alert triggers onto a specific student ID
   */
  sendToStudentPay: async (payload: { studentId: string; title: string; message: string }): Promise<ApiResponse<{ notification: Notification }>> => {
    const { data } = await axiosInstance.post("/notifications/student", payload);
    return data;
  },

  /**
   * Dispatches notifications out to the entire registered campus
   */
  broadcastToAll: async (payload: { title: string; message: string }): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post("/notifications/broadcast", payload);
    return data;
  },

  /**
   * Channels notice items down to selected courses / semesters
   */
  sendToCohort: async (payload: { course?: string; semester?: number; title: string; message: string }): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post("/notifications/cohort", payload);
    return data;
  },

  /**
   * Retrieves administrative dispatch history
   */
  getHistory: async (): Promise<ApiResponse<{ history: Notification[] }>> => {
    const { data } = await axiosInstance.get("/notifications/history");
    return data;
  },

  /**
   * Retracts and deletes selected notification entries
   */
  deleteEntry: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.delete(`/notifications/${id}`);
    return data;
  },
};
