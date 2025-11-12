import DashboardLayout from "../components/DashboardLayout";
import { navLinks } from "../components/navlinks";
export default function OrgDashboardPage() {
  return (
   <DashboardLayout navLinks={navLinks} headerTitle="Organization Admin"/>
  );
}
