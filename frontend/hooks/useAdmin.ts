import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminApi } from "@/lib/api/admin";
import { toast } from "sonner";

export const useAdmin = () => {
  const queryClient = useQueryClient();

  const useStudentsQuery = (filters?: any) => {
    return useQuery({
      queryKey: ["admin-students", filters],
      queryFn: async () => {
        const res = await adminApi.getStudents(filters);
        return res.data;
      },
    });
  };

  const useStudentDetail = (id: string) => {
    return useQuery({
      queryKey: ["admin-students-details", id],
      queryFn: async () => {
        const res = await adminApi.getStudentById(id);
        return res.data.student;
      },
      enabled: !!id,
    });
  };

  const useCreateStudentMutation = () => {
    return useMutation({
      mutationFn: adminApi.createStudent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-students"] });
        toast.success("Student profile provisioned successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to create student.");
      },
    });
  };

  const useUpdateStudentMutation = () => {
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: any }) => 
        adminApi.updateStudent(id, payload),
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ["admin-students"] });
        queryClient.invalidateQueries({ queryKey: ["admin-students-details", variables.id] });
        toast.success("Student records updated successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to update record.");
      },
    });
  };

  const useDeleteStudentMutation = () => {
    return useMutation({
      mutationFn: adminApi.deleteStudent,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-students"] });
        toast.success("Student profile deleted permanently.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Deletion failed.");
      },
    });
  };

  const useToggleCardMutation = () => {
    return useMutation({
      mutationFn: ({ id, status }: { id: string; status: any }) => 
        adminApi.toggleCardStatus(id, status),
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ["admin-students"] });
        queryClient.invalidateQueries({ queryKey: ["admin-students-details", variables.id] });
        toast.success(`Identity card status updated to ${variables.status}`);
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to modify card locks status.");
      },
    });
  };

  const useStatsQuery = () => {
    return useQuery({
      queryKey: ["admin-dashboard-stats"],
      queryFn: async () => {
        const res = await adminApi.getStats();
        return res.data;
      },
      refetchInterval: 30000, // Automates stat screen refresh refreshes every 30 seconds
    });
  };

  const useBulkImportMutation = () => {
    return useMutation({
      mutationFn: adminApi.bulkImport,
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["admin-students"] });
        toast.success(`Rosters load complete inside CSV logs records. Processed: ${res.data.processed}`);
        if (res.data.failures && res.data.failures.length > 0) {
          toast.warning(`Note: ${res.data.failures.length} rows failed validation checks.`);
        }
      },
      onError: (err: any) => {
        toast.error(err.message || "Roster imports failed validation.");
      },
    });
  };

  const useAuditLogsQuery = (filters?: any) => {
    return useQuery({
      queryKey: ["admin-audit-logs", filters],
      queryFn: async () => {
        const res = await adminApi.getAuditLogs(filters);
        return res.data;
      },
    });
  };

  return {
    useStudents: useStudentsQuery,
    useStudentDetail,
    useCreateStudent: useCreateStudentMutation,
    useUpdateStudent: useUpdateStudentMutation,
    useDeleteStudent: useDeleteStudentMutation,
    useToggleCard: useToggleCardMutation,
    useStats: useStatsQuery,
    useBulkImport: useBulkImportMutation,
    useAuditLogs: useAuditLogsQuery,
  };
};
