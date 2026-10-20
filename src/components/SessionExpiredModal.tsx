"use client";

import { FiRefreshCw, FiLogOut } from "react-icons/fi";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

// Helper function to prevent duplicate toasts
const showToast: {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => void;
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => void;
} = {
  success: (message: string, options?: Parameters<typeof toast.success>[1]) => {
    toast.dismiss();
    toast.success(message, options);
  },
  error: (message: string, options?: Parameters<typeof toast.error>[1]) => {
    toast.dismiss();
    toast.error(message, options);
  },
} as const;

type SessionExpiredModalProps = {
  isOpen: boolean;
  onClose: () => void;
  canRefresh?: boolean; // Whether refresh token is still valid
};

export default function SessionExpiredModal({ isOpen, onClose, canRefresh = true }: SessionExpiredModalProps) {
  const { refreshAccessToken, logout } = useAuthActions();
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const result = await refreshAccessToken();
      if (result.success) {
        showToast.success("Session refreshed successfully!");
        onClose();
      } else {
        showToast.error(result.error || "Failed to refresh session");
      }
    } catch (error) {
      console.error("Failed to refresh token:", error);
      showToast.error("Failed to refresh session");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // logout() clears the auth store (including sessionExpired — see
      // authStore.logout) and all cookies before the server call
      await logout();
      // Close the modal before navigating: SessionProvider lives in the
      // root layout, so an open modal would otherwise follow the user to
      // the login screen
      onClose();
      router.push("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
      setIsLoggingOut(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Session Expired
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8">
          {canRefresh 
            ? "Your session has expired. You can refresh your session to continue or log out."
            : "Your session has expired. Please log in again."
          }
        </p>
        <div className="flex flex-col gap-3 sm:gap-4">
          {canRefresh && (
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex-1 hover:cursor-pointer flex items-center justify-center gap-2 py-2 sm:py-3 px-4 sm:px-6 bg-(--buttonPrimary) text-white text-sm sm:text-base font-semibold rounded-xl hover:opacity-90 transition-class disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiRefreshCw className={isRefreshing ? "animate-spin" : ""} />
              {isRefreshing ? "Refreshing..." : "Refresh Session"}
            </button>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 hover:cursor-pointer flex items-center justify-center gap-2 py-2 sm:py-3 px-4 sm:px-6 bg-gray-200 text-gray-900 text-sm sm:text-base font-semibold rounded-xl hover:bg-gray-300 transition-class disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiLogOut />
            {isLoggingOut ? "Signing Out..." : "Log Out"}
          </button>
        </div>
      </div>
    </div>
  );
}
