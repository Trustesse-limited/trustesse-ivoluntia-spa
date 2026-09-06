import {
  FiHome,
  FiCalendar,
  FiUsers,
  FiStar,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import { MdOutlineVolunteerActivism } from "react-icons/md";
import { MdWifiTethering } from "react-icons/md";

export const navLinks = [
  { label: "Dashboard", href: "/org/dashboard", icon: <FiHome /> },
  { label: "Programs", href: "/org/programs", icon: <FiCalendar /> },
  { label: "Volunteers", href: "/org/volunteers", icon: <FiUsers /> },
  {
    label: "Donations",
    href: "/org/donations",
    icon: <MdOutlineVolunteerActivism />,
  },
  { label: "Broadcast", href: "/org/broadcast", icon: <MdWifiTethering /> },
  { label: "Reviews", href: "/org/reviews", icon: <FiStar /> },
  { label: "Help & Support", href: "/org/help", icon: <FiHelpCircle /> },
  { label: "Settings", href: "/org/settings", icon: <FiSettings /> },
];
