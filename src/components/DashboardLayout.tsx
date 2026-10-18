"use client";

import Link from "next/link";
import { FiBell, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { SmartImage } from "@/components/SmartImage";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useAuthActions } from "@/hooks/useAuthActions";
import { useAuthStore } from "@/store";
import { useRouter } from "next/navigation";
import { BRAND_NAME } from "../../constants";
import LogoutModal from "./LogoutModal";
import SessionExpiredModal from "./SessionExpiredModal";
import logger from "@/lib/logger";

type NavLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
  isBottom?: boolean;
};

type DashboardType = 'volunteer' | 'organization' | 'admin';

type DashboardLayoutProps = {
  navLinks?: NavLink[];
  children?: React.ReactNode;
  headerTitle?: string;
  dashboardType: DashboardType;
  userType?: string;
  searchBar?: React.ReactNode;
  showDonateButton?: boolean;
  showNotification?: boolean;
};

// Active link determination logic based on dashboard type
const getIsActiveLink = (pathname: string, linkHref: string, dashboardType: DashboardType): boolean => {
  switch (dashboardType) {
    case 'volunteer':
      // Special case for volunteer: exact match for /home, startsWith for others
      return linkHref === "/home"
        ? pathname === linkHref
        : pathname.startsWith(linkHref);
    case 'organization':
      return pathname.startsWith(linkHref);
    case 'admin':
      return pathname.startsWith(linkHref) && linkHref !== "/login";
    default:
      return pathname === linkHref;
  }
};

// Default nav links based on dashboard type
const getDefaultNavLinks = (dashboardType: DashboardType): NavLink[] => {
  if (dashboardType === 'admin') {
    return [
      { href: "/admin/dashboard", label: "Dashboard" },
      { href: "/admin/organizations", label: "Organizations" },
      { href: "/admin/programs", label: "Programs" },
      { href: "/admin/users", label: "User Management" },
      { href: "/admin/roles", label: "Role Management" },
      { href: "/admin/donations", label: "Donations" },
      { href: "/admin/broadcast", label: "Broadcast" },
      { href: "/admin/reviews", label: "Reviews" },
      { href: "/admin/help", label: "Help & Support" },
      { href: "/admin/settings", label: "Settings" },
    ];
  }
  return [];
};

// Default user type display based on dashboard type
const getDefaultUserType = (dashboardType: DashboardType): string => {
  switch (dashboardType) {
    case 'volunteer':
      return 'Volunteer';
    case 'organization':
      return 'Admin';
    case 'admin':
      return 'Super Admin';
    default:
      return 'User';
  }
};

export default function DashboardLayout({
  navLinks,
  children,
  headerTitle,
  dashboardType,
  userType,
  searchBar,
  showDonateButton = true,
  showNotification = true,
}: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isSessionExpiredModalOpen, setIsSessionExpiredModalOpen] = useState(false);
  const [canRefreshSession, setCanRefreshSession] = useState(true);
  const pathname = usePathname();
  const { validateToken, getFoundationProfile } = useAuthActions();
  const { user, setOrganizationProfile } = useAuthStore();
  const validationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check token expiration periodically
  useEffect(() => {
    const readCookie = (name: string): string | undefined =>
      document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];

    const checkTokenExpiration = async () => {
      // Skip validation if user is currently logging out
      if (isLoggingOut) {
        return;
      }

      try {
        // Local clock check first: token_expiration is a client-readable
        // cookie, so we can detect expiry at the exact moment it happens
        // (validateTokenAction performs the same check server-side with a
        // 1-minute safety buffer)
        const expirationTime = readCookie('token_expiration');
        const isLocallyExpired =
          expirationTime !== undefined &&
          expirationTime !== '' &&
          !Number.isNaN(parseInt(expirationTime, 10)) &&
          Date.now() >= parseInt(expirationTime, 10);

        const result = isLocallyExpired ? { isValid: false } : await validateToken();
        if (!result.isValid) {
          // Check if refresh token is still valid
          const refreshExpiration = readCookie('refresh_token_expiration');

          if (refreshExpiration) {
            const refreshExpiryTime = parseInt(refreshExpiration, 10);
            const isRefreshTokenValid = !Number.isNaN(refreshExpiryTime) && Date.now() < refreshExpiryTime;
            setCanRefreshSession(isRefreshTokenValid);
          } else {
            // No refresh token expiry stored — we cannot verify the refresh
            // token is still valid, so hide the refresh button and only offer
            // logout. A working refresh requires a re-login.
            setCanRefreshSession(false);
          }

          setIsSessionExpiredModalOpen(true);
        }
      } catch (error) {
        console.error("Failed to validate token:", error);
        // If validation fails, show session expired modal but allow refresh
        setCanRefreshSession(true);
        setIsSessionExpiredModalOpen(true);
      }
    };

    // Check immediately on mount
    checkTokenExpiration();

    // Check every 5 minutes (covers server-side revocation / clock drift)
    validationIntervalRef.current = setInterval(checkTokenExpiration, 5 * 60 * 1000);

    // Also fire the moment the access token actually expires so the modal
    // doesn't appear up to 5 minutes late
    let expiryTimeout: NodeJS.Timeout | null = null;
    const expirationTime = readCookie('token_expiration');
    if (expirationTime) {
      const remainingMs = parseInt(expirationTime, 10) - Date.now();
      if (!Number.isNaN(remainingMs) && remainingMs > 0) {
        expiryTimeout = setTimeout(checkTokenExpiration, remainingMs);
      }
    }

    return () => {
      if (validationIntervalRef.current) {
        clearInterval(validationIntervalRef.current);
      }
      if (expiryTimeout) {
        clearTimeout(expiryTimeout);
      }
    };
  }, [validateToken, isLoggingOut]);

  // Clear validation interval when logout starts to prevent race condition
  useEffect(() => {
    if (isLoggingOut && validationIntervalRef.current) {
      clearInterval(validationIntervalRef.current);
      validationIntervalRef.current = null;
    }
  }, [isLoggingOut]);

  // Fetch organization profile once for organization users
  useEffect(() => {
    const fetchOrganizationProfile = async () => {
      // Check for both 'Foundation' (from backend) and 'Organization' (normalized in auth store)
      const isOrganizationUser = user?.accountType === 'Foundation' || user?.accountType === 'Organization';

      if (dashboardType === 'organization' && !user?.organizationProfile && isOrganizationUser) {
        try {
          const result = await getFoundationProfile();
          if (result.success && result.data) {
            // Create default location from profile address data
            const defaultLocation = {
              address: result.data.address || '',
              city: result.data.city || '',
              state: result.data.foundationState || '',
              country: result.data.foundationCountry || '',
              zipcode: result.data.zipCode || '',
            };

            const profileData = {
              name: result.data.name,
              email: result.data.email,
              foundationCategory: result.data.foundationCategory,
              website: result.data.website,
              mission: result.data.mission,
              address: result.data.address,
              city: result.data.city,
              zipcode: result.data.zipCode,
              foundationCountry: result.data.foundationCountry,
              foundationState: result.data.foundationState,
              causes: result.data.causes || undefined,
              logoUrl: result.data.logoUrl,
              locations: [defaultLocation],
            };

            setOrganizationProfile(profileData);
          }
        } catch (error) {
          logger.error('Failed to fetch organization profile:', error);
        }
      }
    };
    fetchOrganizationProfile();
  }, [dashboardType, user?.organizationProfile, user?.accountType, getFoundationProfile, setOrganizationProfile]);

  const { logout } = useAuthActions();
  const router = useRouter();

  // Get organization logo with priority:
  // 1. Auth store logo (from login response)
  // 2. Auth store userImage
  // 3. Onboarding local storage (for first-time users after completing onboarding)
  const getOrganizationLogo = () => {
    // First check auth store
    if (user?.logo) return user.logo;
    if (user?.userImage) return user.userImage;

    // Then check onboarding local storage for organizations
    if (user?.accountType === 'Organization' && typeof window !== 'undefined') {
      const onboardingData = localStorage.getItem('onboarding-storage');
      if (onboardingData) {
        try {
          const parsed = JSON.parse(onboardingData);
          if (parsed.state?.formData?.orgData?.logo) {
            return parsed.state.formData.orgData.logo;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }

    // Check onboarding local storage for volunteers
    if (user?.accountType === 'Volunteer' && typeof window !== 'undefined') {
      const onboardingData = localStorage.getItem('onboarding-storage');
      if (onboardingData) {
        try {
          const parsed = JSON.parse(onboardingData);
          if (parsed.state?.formData?.profileAndBioData?.profileImageurl) {
            return parsed.state.formData.profileAndBioData.profileImageurl;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }

    return null;
  };

  const organizationLogo = getOrganizationLogo();

  // Get initials for avatar fallback
  const getInitials = () => {
    // Check onboarding local storage first for name data
    if (typeof window !== 'undefined') {
      const onboardingData = localStorage.getItem('onboarding-storage');
      if (onboardingData) {
        try {
          const parsed = JSON.parse(onboardingData);

          // For organizations, use organization name from onboarding
          if (user?.accountType === 'Organization' && parsed.state?.formData?.orgData?.name) {
            const name = parsed.state.formData.orgData.name;
            const words = name.split(' ').filter((w: string) => w.length > 0);
            if (words.length >= 2) {
              return (words[0][0] + words[1][0]).toUpperCase();
            }
            return name.slice(0, 2).toUpperCase();
          }

          // For volunteers, use name from onboarding
          if (user?.accountType === 'Volunteer' && parsed.state?.formData?.bioData) {
            const bioData = parsed.state.formData.bioData;
            const firstName = bioData.firstName;
            const lastName = bioData.lastName;

            if (firstName && lastName) {
              return (firstName[0] + lastName[0]).toUpperCase();
            }
            if (firstName) {
              return firstName.slice(0, 2).toUpperCase();
            }
          }
        } catch {
          // Ignore parse errors
        }
      }
    }

    // Fall back to auth store data
    // For organizations, use organization name
    if (user?.accountType === 'Organization') {
      const name = user?.organizationName || user?.firstName;
      if (name) {
        const words = name.split(' ').filter((w: string) => w.length > 0);
        if (words.length >= 2) {
          return (words[0][0] + words[1][0]).toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
      }
    }

    // For volunteers, use first and last name from auth store
    if (user?.firstName) {
      if (user?.lastName) {
        return (user.firstName[0] + user.lastName[0]).toUpperCase();
      }
      return user.firstName.slice(0, 2).toUpperCase();
    }

    // Final fallback to email
    if (user?.email) {
      return user.email.slice(0, 2).toUpperCase();
    }

    return 'UN';
  };

  const avatarInitials = getInitials();

  // Use provided nav links or default based on dashboard type
  const links = navLinks || getDefaultNavLinks(dashboardType);
  
  // Use provided user type or default based on dashboard type
  const displayUserType = userType || getDefaultUserType(dashboardType);

  const handleLogoutClick = () => {
    setIsMobileNavOpen(false);
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    // Close session expired modal if it's open to prevent confusion
    setIsSessionExpiredModalOpen(false);
    const result = await logout();
    if (result.success) {
      setIsLogoutModalOpen(false);
      router.push('/login');
    } else {
      // Only reset if logout failed
      setIsLoggingOut(false);
    }
  };

  const handleLogoutCancel = () => {
    if (!isLoggingOut) {
      setIsLogoutModalOpen(false);
    }
  };

  const isAdmin = dashboardType === 'admin';

  return (
    <div className="flex w-full h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar (Desktop Only) */}
      <aside className="hidden md:flex flex-col w-52 bg-white border-r border-[#A9A7A7] shadow-md fixed top-0 left-0 bottom-0 z-20">
        <div className="h-20 flex items-center justify-start pl-8 border-b-2 border-[#A9A7A7]">
          <h1 className="text-xl font-bold text-black">{BRAND_NAME}</h1>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <ul>
            {links.filter(link => !link.isBottom).map((link) => {
              const isActive = getIsActiveLink(pathname, link.href, dashboardType);
              return (
                <li key={link.href} className="mb-2">
                  <Link
                    href={link.href}
                    className={`rounded-xl w-full flex items-center justify-start py-2 px-4 text-sm font-semibold ${
                      isActive
                        ? "bg-[#0E68DC] text-[#FFFFFF]"
                        : "text-black bg-transparent hover:bg-[#0e67dc46]"
                    } `}
                  >
                    {link.icon && <span className="mr-2">{link.icon}</span>}
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Bottom Links (for volunteer dashboard) */}
        {links.some(link => link.isBottom) && (
          <footer className="px-4 pb-6 md:pb-8 mt-auto border-t border-gray-200 pt-4">
            <ul>
              {links.filter(link => link.isBottom).map((link) => {
                const isActive = getIsActiveLink(pathname, link.href, dashboardType);
                return (
                  <li key={link.href} className="mb-2">
                    <Link
                      href={link.href}
                      className={`rounded-xl w-full flex items-center justify-start py-2 px-4 text-sm font-semibold ${
                        isActive
                          ? "bg-[#0E68DC] text-[#FFFFFF]"
                          : "text-black bg-transparent hover:bg-[#0e67dc46]"
                      } `}
                    >
                      {link.icon && <span className="mr-2">{link.icon}</span>}
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </footer>
        )}

        {/* Logout Link */}
        <footer className="px-4 pb-6 md:pb-8 mt-auto">
          <button
            onClick={handleLogoutClick}
            disabled={isLoggingOut}
            className="rounded-xl w-full flex items-center justify-start transition-class py-2 px-4 text-sm font-semibold text-black hover:text-red-600 hover:bg-[#0000011c] transition-class disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiLogOut className="mr-2 text-lg" />
            {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
          </button>
        </footer>
      </aside>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 backdrop-blur-sm backdrop-brightness-75 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileNavOpen(false)}
            />
            <motion.div
              className="fixed top-0 left-0 w-[70%] min-w-72 h-full bg-white shadow-lg z-50 p-4 flex flex-col md:hidden rounded-r-lg"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween" }}
            >
              <div className="flex-1 overflow-y-auto scrollbar-hide">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-base sm:text-lg font-bold truncate">
                    {BRAND_NAME}
                  </h2>
                  <button
                    title="Close Menu"
                    onClick={() => setIsMobileNavOpen(false)}
                  >
                    <FiX className="text-xl text-gray-600 cursor-pointer" />
                  </button>
                </div>
                <nav>
                  <ul>
                    {links.filter(link => !link.isBottom).map((link) => {
                      const isActive = getIsActiveLink(pathname, link.href, dashboardType);
                      return (
                        <li key={link.href} className="mb-2">
                          <Link
                            href={link.href}
                            className={`rounded-xl w-full flex items-center justify-start transition-class py-2 px-4 text-sm font-semibold ${
                              isActive
                                ? "bg-[var(--buttonPrimary)] text-[#FFFFFF]"
                                : "text-black bg-transparent"
                            } hover:bg-[var(--buttonPrimary)] hover:text-[#FFFFFF]`}
                            onClick={() => setIsMobileNavOpen(false)}
                          >
                            {link.icon && (
                              <span className="mr-2">{link.icon}</span>
                            )}
                            {link.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Bottom Links (for volunteer dashboard) */}
                {links.some(link => link.isBottom) && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <nav>
                      <ul>
                        {links.filter(link => link.isBottom).map((link) => {
                          const isActive = getIsActiveLink(pathname, link.href, dashboardType);
                          return (
                            <li key={link.href} className="mb-2">
                              <Link
                                href={link.href}
                                className={`rounded-xl w-full flex items-center justify-start transition-class py-2 px-4 text-sm font-semibold ${
                                  isActive
                                    ? "bg-[var(--buttonPrimary)] text-[#FFFFFF]"
                                    : "text-black bg-transparent"
                                } hover:bg-[var(--buttonPrimary)] hover:text-[#FFFFFF]`}
                                onClick={() => setIsMobileNavOpen(false)}
                              >
                                {link.icon && (
                                  <span className="mr-2">{link.icon}</span>
                                )}
                                {link.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </nav>
                  </div>
                )}
              </div>

              {/* Logout Link */}
              <div className="mt-4">
                <button
                  onClick={handleLogoutClick}
                  disabled={isLoggingOut}
                  className="rounded-xl w-full flex items-center justify-start transition-class py-2 px-4 text-sm font-semibold text-black hover:text-red-600 hover:bg-[#0000011c] transition-class disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FiLogOut className="mr-2 text-lg" />
                  {isLoggingOut ? 'Signing Out...' : 'Sign Out'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Section */}
      <div className="flex flex-col flex-1 md:ml-52 h-full">
        {isAdmin ? (
          // Admin Header with search bar
          <header className="sticky top-0 z-30 bg-white h-19.5 flex items-center justify-between gap-4 px-4 md:px-6 border-[#A9A7A7]">
            <div className="flex items-center gap-4">
              <button
                title="Open Menu"
                onClick={() => setIsMobileNavOpen(true)}
                className="md:hidden cursor-pointer"
              >
                <FiMenu className="text-2xl text-gray-700" />
              </button>
              <h1 className="text-lg md:hidden font-bold text-black w-fit">
                {BRAND_NAME}
              </h1>
            </div>
            
            <div className="flex w-full justify-between items-center gap-4">
              {/* Search Bar */}
              {searchBar}
              
              {/* Notification and Profile */}
              <div className="flex items-center gap-3">
                {/* Notification Bell */}
                {showNotification && (
                  <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <FiBell className="text-xl text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  </button>
                )}
                
                {/* Admin Profile */}
                <div className="flex items-center px-2 py-1 rounded-xl bg-[#ECF6FE] gap-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
                    {organizationLogo ? (
                      <SmartImage
                        src={organizationLogo}
                        alt="Admin Avatar"
                        width={32}
                        height={32}
                        className="object-cover"
                        objectFit="cover"
                        fallbackSrc="/images/Ellipse 1.png"
                      />
                    ) : (
                      <span className="text-white text-xs font-semibold">{avatarInitials}</span>
                    )}
                  </div>
                  <span className="hidden sm:inline text-sm font-semibold bg-gradient-to-r from-[#9161FD] to-[#06A3DA] bg-clip-text text-transparent">
                    {displayUserType}
                  </span>
                </div>
              </div>
            </div>
          </header>
        ) : (
          // Standard Header
          <header className="sticky top-0 z-30 bg-white h-20 flex items-center justify-between gap-4 px-4 md:px-6 border-b sm:border-b-2 border-[#A9A7A7]">
            <h1 className="text-lg md:hidden font-bold text-black w-fit">
              {BRAND_NAME}
            </h1>
            <h2 className="hidden md:block text-xl font-bold text-[#000000]">
              {headerTitle}
            </h2>
            <div className="flex items-center space-x-4">
              {showDonateButton && (
                <button className="hidden md:block bg-[var(--buttonPrimary)] text-white text-sm font-semibold px-6 py-2 rounded-xl transition-class cursor-pointer hover:opacity-90">
                  Donate
                </button>
              )}
              {showNotification && (
                <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#ECF6FE]">
                  <FiBell className="text-gray-600 text-xl cursor-pointer" />
                </div>
              )}
              <div className="flex items-center px-2 py-1 rounded-xl gap-2 bg-[#ECF6FE] ">
                <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-300 flex items-center justify-center bg-linear-to-br from-blue-500 to-blue-600">
                  {organizationLogo ? (
                    <SmartImage
                      src={organizationLogo}
                      alt={`${displayUserType} Avatar`}
                      width={32}
                      height={32}
                      className="object-cover"
                      objectFit="cover"
                      fallbackSrc="/images/Ellipse 1.png"
                    />
                  ) : (
                    <span className="text-white text-xs font-semibold">{avatarInitials}</span>
                  )}
                </div>
                <span className="hidden md:inline text-sm font-semibold bg-gradient-to-r from-[#9161FD] to-[#06A3DA] bg-clip-text text-transparent">
                  {displayUserType}
                </span>
              </div>
              <button
                title="Open Menu"
                onClick={() => setIsMobileNavOpen(true)}
                className="md:hidden cursor-pointer"
              >
                <FiMenu className="text-2xl text-gray-700" />
              </button>
            </div>
          </header>
        )}

        <main className="flex-1 overflow-y-auto">
          <div className="max-w-full w-full">{children}</div>
        </main>
      </div>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
      />

      {/* Session Expired Modal */}
      <SessionExpiredModal
        isOpen={isSessionExpiredModalOpen}
        onClose={() => setIsSessionExpiredModalOpen(false)}
        canRefresh={canRefreshSession}
      />
    </div>
  );
}
