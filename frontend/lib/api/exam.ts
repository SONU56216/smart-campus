import axiosInstance from "../axios";
import { ApiResponse, ExamForm, AdmitCard, PaginatedResponse } from "@/types";

export const examApi = {
  // ==========================================
  // STUDENT METHODS
  // ==========================================

  /**
   * Reads target fees and rules configuration
   */
  getAvailableExams: async (): Promise<ApiResponse<{ examSession: string; examFee: number; backlogSubjectFee: number; lateFee: number }>> => {
    const { data } = await axiosInstance.get("/exams/available");
    return data;
  },

  /**
   * Indexes semester exams registration parameters
   */
  submitExamForm: async (payload: any): Promise<ApiResponse<{ examForm: ExamForm }>> => {
    const { data } = await axiosInstance.post("/exams/submit", payload);
    return data;
  },

  /**
   * Retrieves full details of registered forms
   */
  getMyExamForms: async (): Promise<ApiResponse<{ examForms: ExamForm[] }>> => {
    const { data } = await axiosInstance.get("/exams/my-forms");
    return data;
  },

  /**
   * Detail check of specific exam form
   */
  getExamFormById: async (id: string): Promise<ApiResponse<{ examForm: ExamForm }>> => {
    const { data } = await axiosInstance.get(`/exams/my-forms/${id}`);
    return data;
  },

  /**
   * Resolves exam registration invoice balances
   */
  payExamFee: async (id: string, paymentGateway: string): Promise<ApiResponse<any>> => {
    const { data } = await axiosInstance.post(`/exams/my-forms/${id}/pay`, { paymentGateway });
    return data;
  },

  /**
   * Lists released examination admit cards
   */
  getMyAdmitCards: async (): Promise<ApiResponse<{ admitCards: AdmitCard[] }>> => {
    const { data } = await axiosInstance.get("/exams/my-admit-cards");
    return data;
  },

  /**
   * Streams PDF formatted ticket directly to user devices
   */
  downloadAdmitCard: async (cardId: string): Promise<ArrayBuffer> => {
    const { data } = await axiosInstance.get(`/exams/my-admit-cards/${cardId}/download`, {
      responseType: "arraybuffer",
    });
    return data;
  },

  /**
   * Fetches data payloads to instantiate Google Wallet / offline ticket cards
   */
  syncWalletCard: async (cardId: string): Promise<ApiResponse<any>> => {
    const { data } = await axiosInstance.post(`/exams/my-admit-cards/${cardId}/wallet`);
    return data;
  },

  /**
   * Returns current semester schedules
   */
  getSchedule: async (course?: string, semester?: number): Promise<ApiResponse<{ schedule: any[] }>> => {
    const { data } = await axiosInstance.get("/exams/schedule", { params: { course, semester } });
    return data;
  },

  /**
   * Displays published scorecard transcripts
   */
  getResults: async (): Promise<ApiResponse<{ sgpa: number; transcript: any[]; isPublished: boolean }>> => {
    const { data } = await axiosInstance.get("/exams/results");
    return data;
  },

  // ==========================================
  // OFFICE STAFF / OFFICE OF COE METHODS
  // ==========================================

  /**
   * Lists registration rosters paginated
   */
  getAllExamForms: async (params?: {
    page?: number;
    limit?: number;
    semester?: number;
    status?: string;
  }): Promise<PaginatedResponse<ExamForm>> => {
    const { data } = await axiosInstance.get("/exams/admin/forms", { params });
    return data;
  },

  /**
   * Validates details approving or rejecting registration forms
   */
  verifyExamForm: async (id: string, action: "APPROVED" | "REJECTED"): Promise<ApiResponse<{ examForm: ExamForm }>> => {
    const { data } = await axiosInstance.post(`/exams/admin/forms/${id}/verify`, { action });
    return data;
  },

  /**
   * Generates secure QR admit cards for paid applicants
   */
  generateCards: async (ids: string[]): Promise<ApiResponse<{ message: string }>> => {
    const { data } = await axiosInstance.post("/exams/admin/admit-cards/generate", { ids });
    return data;
  },

  /**
   * Configures primary semester subject schedule structures
   */
  updateSchedule: async (payload: { course: string; semester: number; schedule: any[] }): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post("/exams/admin/schedule", payload);
    return data;
  },

  /**
   * Runs sitting desk arrangement solvers
   */
  assignSeats: async (payload: { semester: number; hallPrefix: string; startingSeat: number }): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post("/exams/admin/seating", payload);
    return data;
  },

  /**
   * Overrides score grades
   */
  uploadMarks: async (payload: { semester: number; subjectCode: string; scoresStream: any[] }): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post("/exams/admin/marks/upload", payload);
    return data;
  },

  /**
   * Unlocks scorecard transcript view checks for student portals
   */
  publishResults: async (payload: { semester: number; academicYear: string }): Promise<ApiResponse<null>> => {
    const { data } = await axiosInstance.post("/exams/admin/results/publish", payload);
    return data;
  },
};
