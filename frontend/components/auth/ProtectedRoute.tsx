"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Loading from "@/components/ui/Loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading, fetchMe } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      // If token exists but not authenticated yet, try loading profile details once
      if (!isAuthenticated && typeof window !== "undefined" && localStorage.getItem("token")) {
        try {
          await fetchMe();
        } catch (e) {
          // Token expired or invalid
        }
      }
      setIsVerifying(false);
    };
    verifyToken();
  }, [isAuthenticated, fetchMe]);

  useEffect(() => {
    if (!isVerifying && !isLoading) {
      if (!isAuthenticated) {
        // Redirect to login page and preserve requested destination route
        router.replace(`/login?redirect=${encodeURIComponent(pathname)}`);
      } else if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        // Role mismatch - redirect appropriately
        if (user.role === "STUDENT") {
          router.replace("/student/dashboard");
        } else {
          router.replace("/admin/dashboard");
        }
      }
    }
  }, [isAuthenticated, isLoading, user, router, pathname, isVerifying, allowedRoles]);

  if (isLoading || isVerifying || (isAuthenticated && allowedRoles && user && !allowedRoles.includes(user.role))) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loading message="Securing connection and auditing access codes..." />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
}
