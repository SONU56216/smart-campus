"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PersonalDetails {
  fullName: string;
  dob: string;
  gender: string;
  category: string;
  bloodGroup: string;
}

export interface AcademicHistory {
  class10Marks: string;
  class10Board: string;
  class10Year: string;
  class12Marks: string;
  class12Board: string;
  class12Year: string;
  entranceExamName: string;
  entranceExamScore: string;
}

export interface CoursePreferences {
  firstChoice: string;
  secondChoice: string;
  thirdChoice: string;
}

export interface DocumentUploads {
  photo: string;
  signature: string;
  class10Marksheet: string;
  class12Marksheet: string;
  idProof: string;
  photoProgress?: number;
  signatureProgress?: number;
  class10Progress?: number;
  class12Progress?: number;
  idProgress?: number;
}

export interface AdmissionStoreState {
  step: number;
  personal: PersonalDetails;
  academic: AcademicHistory;
  courses: CoursePreferences;
  documents: DocumentUploads;
  acceptedDeclaration: boolean;
  completedSteps: boolean[];
  setStep: (step: number) => void;
  setPersonal: (data: Partial<PersonalDetails>) => void;
  setAcademic: (data: Partial<AcademicHistory>) => void;
  setCourses: (data: Partial<CoursePreferences>) => void;
  setDocuments: (data: Partial<DocumentUploads>) => void;
  setAcceptedDeclaration: (val: boolean) => void;
  markStepComplete: (stepIndex: number, complete: boolean) => void;
  resetStore: () => void;
}

const initialPersonal: PersonalDetails = {
  fullName: "",
  dob: "",
  gender: "MALE",
  category: "GENERAL",
  bloodGroup: "O+",
};

const initialAcademic: AcademicHistory = {
  class10Marks: "",
  class10Board: "CBSE",
  class10Year: "2022",
  class12Marks: "",
  class12Board: "CBSE",
  class12Year: "2024",
  entranceExamName: "JEE MAIN",
  entranceExamScore: "",
};

const initialCourses: CoursePreferences = {
  firstChoice: "",
  secondChoice: "",
  thirdChoice: "",
};

const initialDocuments: DocumentUploads = {
  photo: "",
  signature: "",
  class10Marksheet: "",
  class12Marksheet: "",
  idProof: "",
  photoProgress: 0,
  signatureProgress: 0,
  class10Progress: 0,
  class12Progress: 0,
  idProgress: 0,
};

export const useAdmissionStore = create<AdmissionStoreState>()(
  persist(
    (set) => ({
      step: 1,
      personal: initialPersonal,
      academic: initialAcademic,
      courses: initialCourses,
      documents: initialDocuments,
      acceptedDeclaration: false,
      completedSteps: [false, false, false, false, false],

      setStep: (step) => set({ step }),
      setPersonal: (data) =>
        set((state) => ({ personal: { ...state.personal, ...data } })),
      setAcademic: (data) =>
        set((state) => ({ academic: { ...state.academic, ...data } })),
      setCourses: (data) =>
        set((state) => ({ courses: { ...state.courses, ...data } })),
      setDocuments: (data) =>
        set((state) => ({ documents: { ...state.documents, ...data } })),
      setAcceptedDeclaration: (acceptedDeclaration) => set({ acceptedDeclaration }),
      markStepComplete: (stepIndex, complete) =>
        set((state) => {
          const updated = [...state.completedSteps];
          updated[stepIndex] = complete;
          return { completedSteps: updated };
        }),
      resetStore: () =>
        set({
          step: 1,
          personal: initialPersonal,
          academic: initialAcademic,
          courses: initialCourses,
          documents: initialDocuments,
          acceptedDeclaration: false,
          completedSteps: [false, false, false, false, false],
        }),
    }),
    {
      name: "campuspass-admission-registry",
    }
  )
);
