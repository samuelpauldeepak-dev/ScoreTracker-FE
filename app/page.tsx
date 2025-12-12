"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { AuthPage } from "@/components/auth-page";

export default function HomePage() {
  const { isAuthenticated, initializeMockData } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    // Initialize mock data on first load
    const hasInitialized = localStorage.getItem("score-tracker-initialized");
    if (!hasInitialized) {
      initializeMockData();
      localStorage.setItem("score-tracker-initialized", "true");
    }

    // Redirect to dashboard if authenticated
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router, initializeMockData]);

  if (isAuthenticated) {
    return null; // Will redirect to dashboard
  }

  return <AuthPage />;
}
