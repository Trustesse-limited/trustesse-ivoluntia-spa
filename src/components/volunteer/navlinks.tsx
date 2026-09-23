import {
  FiHome,
  FiUser,
  FiActivity,
  FiHeart,
  FiAward,
  FiSettings,
} from "react-icons/fi";

export const navLinks = [
  { label: "Home", href: "/volunteer", icon: <FiHome /> },
  { label: "Profile", href: "/volunteer/profile", icon: <FiUser /> },
  { label: "Activity", href: "/volunteer/activity", icon: <FiActivity /> },
  { label: "Favourites", href: "/volunteer/favourites", icon: <FiHeart /> },
  { label: "Achievements", href: "/volunteer/achievements", icon: <FiAward /> },
  { label: "Settings", href: "/volunteer/settings", icon: <FiSettings /> },
];
