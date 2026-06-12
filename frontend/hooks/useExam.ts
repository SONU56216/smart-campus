import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { examApi } from "@/lib/api/exam";
import { toast } from "sonner";

export const useExam = () => {
  const queryClient = useQueryClient();

  const useAvailableExamsQuery = () => {
    return useQuery({
      queryKey: ["exams-available-rules"],
      queryFn: async () => {
        const res = await examApi.getAvailableExams();
        return res.data;
      },
    });
  };

  const useSubmitExamFormMutation = () => {
    return useMutation({
      mutationFn: examApi.submitExamForm,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["my-exam-forms"] });
        toast.success("Exam registration list locked successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Exam submission rejected.");
      },
    });
  };

  const useMyExamFormsQuery = () => {
    return useQuery({
      queryKey: ["my-exam-forms"],
      queryFn: async () => {
        const res = await examApi.getMyExamForms();
        return res.data.examForms;
      },
    });
  };

  const useExamFormByIdQuery = (id: string) => {
    return useQuery({
      queryKey: ["exam-form-details", id],
      queryFn: async () => {
        const res = await examApi.getExamFormById(id);
        return res.data.examForm;
      },
      enabled: !!id,
    });
  };

  const usePayExamFeeMutation = () => {
    return useMutation({
      mutationFn: ({ id, gateway }: { id: string; gateway: string }) => 
        examApi.payExamFee(id, gateway),
      onSuccess: (res, variables) => {
        queryClient.invalidateQueries({ queryKey: ["my-exam-forms"] });
        queryClient.invalidateQueries({ queryKey: ["exam-form-details", variables.id] });
        toast.success("Exam entry fee processed successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Fee checkout sequence failed.");
      },
    });
  };

  const useMyAdmitCardsQuery = () => {
    return useQuery({
      queryKey: ["my-admit-cards"],
      queryFn: async () => {
        const res = await examApi.getMyAdmitCards();
        return res.data.admitCards;
      },
    });
  };

  const downloadAdmitCardPdf = async (cardId: string, sem: number) => {
    try {
      toast.loading("Generating secure high-resolution admit card PDF...");
      const buffer = await examApi.downloadAdmitCard(cardId);
      
      const blob = new Blob([buffer], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `admit_card_sem_${sem}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.dismiss();
      toast.success("Admit Card ticket downloaded successfully.");
    } catch (err: any) {
      toast.dismiss();
      toast.error(err.message || "Failed to download admit card.");
    }
  };

  const useSyncWalletCardMutation = () => {
    return useMutation({
      mutationFn: examApi.syncWalletCard,
      onSuccess: () => {
        toast.success("Admit Card ticket synchronized with local digital wallet.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Local wallet sync failed.");
      },
    });
  };

  const useScheduleQuery = (course?: string, semester?: number) => {
    return useQuery({
      queryKey: ["exams-academic-schedule", course, semester],
      queryFn: async () => {
        const res = await examApi.getSchedule(course, semester);
        return res.data.schedule;
      },
    });
  };

  const useResultsQuery = () => {
    return useQuery({
      queryKey: ["student-results-scorecards"],
      queryFn: async () => {
        const res = await examApi.getResults();
        return res.data;
      },
    });
  };

  // ==========================================
  // COE / REGISTRAR ACTIONS
  // ==========================================

  const useAllExamFormsQuery = (filters?: any) => {
    return useQuery({
      queryKey: ["admin-exam-forms", filters],
      queryFn: async () => {
        const res = await examApi.getAllExamForms(filters);
        return res.data;
      },
    });
  };

  const useVerifyExamFormMutation = () => {
    return useMutation({
      mutationFn: ({ id, action }: { id: string; action: "APPROVED" | "REJECTED" }) => 
        examApi.verifyExamForm(id, action),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["admin-exam-forms"] });
        toast.success("Form registration checked and status updated.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Failed to finalize verification.");
      },
    });
  };

  const useGenerateCardsMutation = () => {
    return useMutation({
      mutationFn: examApi.generateCards,
      onSuccess: (res) => {
        queryClient.invalidateQueries({ queryKey: ["admin-exam-forms"] });
        toast.success(res.message || "Secure admit cards batch generated.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Admit card batch issuance failed.");
      },
    });
  };

  const useUpdateScheduleMutation = () => {
    return useMutation({
      mutationFn: examApi.updateSchedule,
      onSuccess: () => {
        toast.success("Exam schedule matrix successfully synchronized.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Schedule update failed.");
      },
    });
  };

  const useAssignSeatsMutation = () => {
    return useMutation({
      mutationFn: examApi.assignSeats,
      onSuccess: () => {
        toast.success("Sitting corridors desks allocated successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Desk allocating structures failed.");
      },
    });
  };

  const useUploadMarksMutation = () => {
    return useMutation({
      mutationFn: examApi.uploadMarks,
      onSuccess: () => {
        toast.success("Grades scoring streams locked successfully.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Marks streams upload rejected.");
      },
    });
  };

  const usePublishResultsMutation = () => {
    return useMutation({
      mutationFn: examApi.publishResults,
      onSuccess: () => {
        toast.success("Score reports unleashed globally to student portals.");
      },
      onError: (err: any) => {
        toast.error(err.message || "Results release execution blocked.");
      },
    });
  };

  return {
    useAvailableExams: useAvailableExamsQuery,
    useSubmitExamForm: useSubmitExamFormMutation,
    useMyExamForms: useMyExamFormsQuery,
    useExamFormById: useExamFormByIdQuery,
    usePayExamFee: usePayExamFeeMutation,
    useMyAdmitCards: useMyAdmitCardsQuery,
    downloadAdmitCardPdf,
    useSyncWalletCard: useSyncWalletCardMutation,
    useSchedule: useScheduleQuery,
    useResults: useResultsQuery,
    
    // Backoffice structures
    useAllExamForms: useAllExamFormsQuery,
    useVerifyExamForm: useVerifyExamFormMutation,
    useGenerateCards: useGenerateCardsMutation,
    useUpdateSchedule: useUpdateScheduleMutation,
    useAssignSeats: useAssignSeatsMutation,
    useUploadMarks: useUploadMarksMutation,
    usePublishResults: usePublishResultsMutation,
  };
};
