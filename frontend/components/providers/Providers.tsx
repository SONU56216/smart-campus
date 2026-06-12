"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // instantiate a stable QueryClient instance in state to bypass layout rerender anomalies
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // cache is considered fresh for 1 minute
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      
      {/* Toast provider styled with high-contrast Material elements */}
      <Toaster 
        position="top-right"
        richColors
        closeButton
        theme="light"
        toastOptions={{
          style: {
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
          }
        }}
      />
    </QueryClientProvider>
  );
}
