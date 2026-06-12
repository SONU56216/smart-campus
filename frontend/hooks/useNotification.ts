import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi } from "@/lib/api/notification";
import { studentApi } from "@/lib/api/student";
import { toast } from "sonner";

export const useNotification = () => {
  const queryClient = useQueryClient();

  /**
   * Reads notification bullet registers for local student dashboard displays
   */
  const useStudentInbox = () => {
    return useQuery({
      queryKey: ["student-inbox-notifications"],
      queryFn: async () => {
        const res = await studentApi.getNotifications();
        return res.data.notifications;
      },
      refetchInterval: 15000, // Inbox poll alerts every 15 seconds
    });
  };

  /**
   * Soft marks alert messages as read updating state managers
   */
  const useMarkRead = () => {
    return useMutation({
      mutationFn: studentApi.markAsRead,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["student-inbox-notifications"] });
      },
    });
  };

  // ==========================================
  // ADMINISTRATOR CONTROLS
  // ==========================================

  const useAdminHistory = () => {
    return useQuery({
      queryKey: ["admin-notifications-dispatch-history"],
      queryFn: async () => {
        const res = await notificationApi.getHistory();
        return res.data.history;
      },
    });
  };

  const useSendToStudent = () => {
    return useMutation({
      mutationFn: notificationApi.sendToStudentPay,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-notifications-dispatch-history"] });
        toast.success("Notification sent directly to target student.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to dispatch alert.");
      },
    });
  };

  const useBroadcastAll = () => {
    return useMutation({
      mutationFn: notificationApi.broadcastToAll,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-notifications-dispatch-history"] });
        toast.success("Broadcast notice dispatched to all devices.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Global broadcast failed.");
      },
    });
  };

  const useSendCohort = () => {
    return useMutation({
      mutationFn: notificationApi.sendToCohort,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-notifications-dispatch-history"] });
        toast.success("Cohort bulletin dispatched successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Cohort dispatch rejected.");
      },
    });
  };

  const useDeleteNotification = () => {
    return useMutation({
      mutationFn: notificationApi.deleteEntry,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-notifications-dispatch-history"] });
        toast.success("Dispatch history item retracted.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Retract action rejected.");
      },
    });
  };

  return {
    useStudentInbox,
    useMarkRead,
    
    // BACKOFFICE ADMIN CHANNELS
    useAdminHistory,
    useSendToStudent,
    useBroadcastAll,
    useSendCohort,
    useDeleteNotification,
  };
};
