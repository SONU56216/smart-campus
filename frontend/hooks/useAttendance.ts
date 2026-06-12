import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { attendanceApi } from "@/lib/api/attendance";
import { toast } from "sonner";

export const useAttendance = () => {
  const queryClient = useQueryClient();

  const useMarkAttendanceMutation = () => {
    return useMutation({
      mutationFn: attendanceApi.markAttendance,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-attendance-stats"] });
        toast.success("Attendance checked in successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to log attendance checkin.");
      },
    });
  };

  const useMyAttendanceQuery = (filters?: any) => {
    return useQuery({
      queryKey: ["my-attendance-stats", filters],
      queryFn: async () => {
        const res = await attendanceApi.getMyAttendance(filters);
        return res.data;
      },
      refetchOnWindowFocus: true,
    });
  };

  // ==========================================
  // STAFF ACTIONS
  // ==========================================

  const useTodayLiveQuery = () => {
    return useQuery({
      queryKey: ["admin-attendance-today-live"],
      queryFn: async () => {
        const res = await attendanceApi.getToday();
        return res.data;
      },
      refetchInterval: 10000, // Syncs today's live gate roll scans list every 10 seconds
    });
  };

  const useRegisterQuery = (filters?: any) => {
    return useQuery({
      queryKey: ["admin-attendance-register", filters],
      queryFn: async () => {
        const res = await attendanceApi.getRegister(filters);
        return res.data;
      },
    });
  };

  const useUpdateRecordMutation = () => {
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: any }) => 
        attendanceApi.updateRecord(id, payload),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-attendance-register"] });
        queryClient.invalidateQueries({ queryKey: ["admin-attendance-today-live"] });
        toast.success("Attendance entry amended successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update attendance record.");
      },
    });
  };

  const useBulkMarkMutation = () => {
    return useMutation({
      mutationFn: attendanceApi.bulkMark,
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["admin-attendance-register"] });
        toast.success(`Batch mark register complete. Processed ${res.data.processed} students.`);
      },
      onError: (err: any) => {
        toast.error(err.message || "Batch registration updates failed.");
      },
    });
  };

  const useReportQuery = (filters: { course: string; semester: number; month?: number }) => {
    return useQuery({
      queryKey: ["admin-attendance-audit-reports", filters],
      queryFn: async () => {
        const res = await attendanceApi.getReport(filters);
        return res.data.report;
      },
      enabled: !!filters.course && !!filters.semester,
    });
  };

  const useNotifyShortageMutation = () => {
    return useMutation({
      mutationFn: attendanceApi.notifyShortage,
      onSuccess: (res) => {
        toast.success(`Broadcasting shortage notices. Sent ${res.data.sentEmailAlertsCount} alerts.`);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failure to disperse attendance notification bulletins.");
      },
    });
  };

  return {
    useMarkAttendance: useMarkAttendanceMutation,
    useMyAttendance: useMyAttendanceQuery,
    
    // BACKOFFICE ADMIN CONTROLS
    useTodayLive: useTodayLiveQuery,
    useRegister: useRegisterQuery,
    useUpdateRecord: useUpdateRecordMutation,
    useBulkMark: useBulkMarkMutation,
    useReport: useReportQuery,
    useNotifyShortage: useNotifyShortageMutation,
  };
};
