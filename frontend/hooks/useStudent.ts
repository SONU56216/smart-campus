import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { studentApi } from "@/lib/api/student";
import { toast } from "sonner";

export const useStudent = () => {
  const queryClient = useQueryClient();

  const useProfile = () => {
    return useQuery({
      queryKey: ["student-profile"],
      queryFn: async () => {
        const res = await studentApi.getProfile();
        return res.data.student;
      },
      retry: 1,
    });
  };

  const useUpdateProfileMutation = () => {
    return useMutation({
      mutationFn: studentApi.updateProfile,
      onSuccess: (res) => {
        queryClient.setQueryData(["student-profile"], res.data.student);
        toast.success("Profile details updated successfully.");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update profile data.");
      },
    });
  };

  const useUploadPhotoMutation = () => {
    return useMutation({
      mutationFn: studentApi.uploadPhoto,
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["student-profile"] });
        toast.success("Identity profile photo uploaded successfully.");
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to upload photo.");
      },
    });
  };

  const useUploadSignatureMutation = () => {
    return useMutation({
      mutationFn: studentApi.uploadSignature,
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["student-profile"] });
        toast.success("Verification signature sample saved successfully.");
      },
      onError: (error: any) => {
        toast.error(error.message || "Signature upload failed.");
      },
    });
  };

  const useLogs = () => {
    return useQuery({
      queryKey: ["student-logs"],
      queryFn: async () => {
        const res = await studentApi.getLogs();
        return res.data.logs;
      },
      refetchInterval: 60000, // Automates logs check checks every minute
    });
  };

  return {
    useProfile,
    useUpdateProfile: useUpdateProfileMutation,
    useUploadPhoto: useUploadPhotoMutation,
    useUploadSignature: useUploadSignatureMutation,
    useLogs,
  };
};
