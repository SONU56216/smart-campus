import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { admissionApi } from "@/lib/api/admission";
import { toast } from "sonner";

export const useAdmission = () => {
  const queryClient = useQueryClient();

  const useSubmitApplicationMutation = () => {
    return useMutation({
      mutationFn: admissionApi.submitApplication,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-admission-applications"] });
        toast.success("Admission application profile logged successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Application registry failed.");
      },
    });
  };

  const useMyApplicationsQuery = () => {
    return useQuery({
      queryKey: ["my-admission-applications"],
      queryFn: async () => {
        const res = await admissionApi.getMyApplications();
        return res.data.applications;
      },
    });
  };

  const useApplicationStatusQuery = (id: string) => {
    return useQuery({
      queryKey: ["admission-application-details", id],
      queryFn: async () => {
        const res = await admissionApi.getApplicationStatus(id);
        return res.data.application;
      },
      enabled: !!id,
    });
  };

  const useUpdateApplicationMutation = () => {
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: any }) => 
        admissionApi.updateApplication(id, payload),
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ["my-admission-applications"] });
        queryClient.invalidateQueries({ queryKey: ["admission-application-details", variables.id] });
        toast.success("Application details updated successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Modify draft application failed.");
      },
    });
  };

  const usePayApplicationFeeMutation = () => {
    return useMutation({
      mutationFn: ({ id, gateway }: { id: string; gateway: string }) => 
        admissionApi.payApplicationFee(id, gateway),
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ["my-admission-applications"] });
        queryClient.invalidateQueries({ queryKey: ["admission-application-details", variables.id] });
        toast.success("Application fee checked out successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Payment checkout sequence rejected.");
      },
    });
  };

  const downloadOfferLetter = async (id: string, refNo: string) => {
    try {
      toast.loading("Generating certified provisional offer letter...");
      const buffer = await admissionApi.downloadAdmissionLetter(id);
      
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `provisional_admission_offer_${refNo}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Admissions provisional offer letter downloaded.");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to compile your certified document PDF.");
    }
  };

  const usePublicMeritListQuery = (course: string) => {
    return useQuery({
      queryKey: ["public-merit-list", course],
      queryFn: async () => {
        const res = await admissionApi.getPublicMeritList(course);
        return res.data.meritList;
      },
      enabled: !!course,
    });
  };

  // ==========================================
  // ADMINISTRATOR METHODS
  // ==========================================

  const useAllApplicationsQuery = (filters?: any) => {
    return useQuery({
      queryKey: ["admin-admission-applications", filters],
      queryFn: async () => {
        const res = await admissionApi.getAllApplications(filters);
        return res.data;
      },
    });
  };

  const useApplicationDetailAdmin = (id: string) => {
    return useQuery({
      queryKey: ["admin-admission-application-details", id],
      queryFn: async () => {
        const res = await admissionApi.getApplicationById(id);
        return res.data.application;
      },
      enabled: !!id,
    });
  };

  const useApproveApplicationMutation = () => {
    return useMutation({
      mutationFn: ({ id, remarks }: { id: string; remarks?: string }) => 
        admissionApi.approveApplication(id, remarks),
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ["admin-admission-applications"] });
        queryClient.invalidateQueries({ queryKey: ["admin-admission-application-details", variables.id] });
        toast.success("Application approved successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Approval failed.");
      },
    });
  };

  const useRejectApplicationMutation = () => {
    return useMutation({
      mutationFn: ({ id, remarks }: { id: string; remarks: string }) => 
        admissionApi.rejectApplication(id, remarks),
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ["admin-admission-applications"] });
        queryClient.invalidateQueries({ queryKey: ["admin-admission-application-details", variables.id] });
        toast.success("Application rejected and alert sent.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Rejection marking failed.");
      },
    });
  };

  const useBulkApproveMutation = () => {
    return useMutation({
      mutationFn: ({ ids, remarks }: { ids: string[]; remarks?: string }) => 
        admissionApi.bulkApprove(ids, remarks),
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["admin-admission-applications"] });
        toast.success(res.message || "Batch complete successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Batch approval sequence failed.");
      },
    });
  };

  const useSendOffersMutation = () => {
    return useMutation({
      mutationFn: admissionApi.sendOfferLetters,
      onSuccess: (res) => {
        toast.success(res.message || "Offers notifications dispatches initiated.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Offers mail dispatches failure.");
      },
    });
  };

  const useGenerateMeritListQuery = (course: string) => {
    return useQuery({
      queryKey: ["admin-merit-list-generator", course],
      queryFn: async () => {
        const res = await admissionApi.generateMeritList(course);
        return res.data.meritList;
      },
      enabled: false, // Explicit triggers only via buttons
    });
  };

  return {
    useSubmitApplication: useSubmitApplicationMutation,
    useMyApplications: useMyApplicationsQuery,
    useApplicationStatus: useApplicationStatusQuery,
    useUpdateApplication: useUpdateApplicationMutation,
    usePayApplicationFee: usePayApplicationFeeMutation,
    downloadOfferLetter,
    usePublicMeritList: usePublicMeritListQuery,
    
    // Admin structures
    useAllApplications: useAllApplicationsQuery,
    useApplicationDetailAdmin,
    useApproveApplication: useApproveApplicationMutation,
    useRejectApplication: useRejectApplicationMutation,
    useBulkApprove: useBulkApproveMutation,
    useSendOffers: useSendOffersMutation,
    useGenerateMeritList: useGenerateMeritListQuery,
  };
};
