import DashboardLayout from "./DashboardLayout";
import {
  FiHome,
  FiUsers,
  FiCalendar,
  FiCast,
  FiStar,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import { FaHandHoldingUsd } from "react-icons/fa"; 
import { MdWifiTethering } from "react-icons/md";


const navLinks = [
  {
    label: "Dashboard",
    href: "/org/dashboard",
    icon: <FiHome className="text-black" />,
  },
  {
    label: "Programs",
    href: "/org/programs",
    icon: <FiCalendar className="text-black" />,
  },
  {
    label: "Volunteers",
    href: "/org/volunteers",
    icon: <FiUsers className="text-black" />,
  },
  {
    label: "Donations",
    href: "/org/donations",
    icon: <FaHandHoldingUsd className="text-black" />,
  },
  {
    label: "Broadcast",
    href: "/org/broadcast",
    icon: <MdWifiTethering className="text-black" />,
  },
  {
    label: "Reviews",
    href: "/org/reviews",
    icon: <FiStar className="text-black" />,
  },
  {
    label: "Help & Support",
    href: "/org/help",
    icon: <FiHelpCircle className="text-black" />,
  },
  {
    label: "Settings",
    href: "/org/settings",
    icon: <FiSettings className="text-black" />,
  },
];


export default function ProgramsPage() {
  return (
    <DashboardLayout navLinks={navLinks}>
      <h1 className="text-2xl font-semibold mb-4">Manage Programs</h1>
      {/* page content */}
    </DashboardLayout>
  );
}
