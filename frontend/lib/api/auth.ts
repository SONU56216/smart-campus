import axiosInstance from "../axios";
import { ApiResponse, Student, Admin } from "@/types";

export const authApi = {
  /**
   * Log into Student or Administrator sub-accounts
   */
  login: async (credentials: any): Promise<ApiResponse<{ token: string; user: any }>> => {
    const isAdmin = credentials.role === "ADMIN" || credentials.role === "admin";
    const endpoint = isAdmin ? "/auth/admin-login" : "/auth/login";
    const payload = isAdmin 
      ? { email: credentials.email, password: credentials.password, otp: credentials.otp }
      : { loginIdentifier: credentials.email, password: credentials.password };
    const { data } = await axiosInstance.post(endpoint, payload);
    return data;
  },

  /**
   * Registers a fresh student application profile
   */
  register: async (studentData: any): Promise<ApiResponse<{ student: Student }>> => {
    const { data } = await axiosInstance.post("/auth/register-student", studentData);
    return data;
  },

  /**
   * Returns details of active browser token session
   */
  getMe: async (): Promise<ApiResponse<{ user: any }>> => {
    const { data } = await axiosInstance.get("/auth/me");
    return data;
  },

  /**
   * Updates standard user passwords
   */
  updatePassword: async (passwordPayload: any): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.put("/auth/update-password", passwordPayload);
    return data;
  },
};
