import { requireRoleOrRedirect } from '@/lib/auth.server';
import AdminShell from './AdminShell';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Server-side guard: only admin/super_admin accounts may enter /admin routes.
  // Unauthenticated users are sent to /login, users of any other role are
  // redirected to their own dashboard (they never see admin screens).
  await requireRoleOrRedirect('admin');

  return <AdminShell>{children}</AdminShell>;
}
