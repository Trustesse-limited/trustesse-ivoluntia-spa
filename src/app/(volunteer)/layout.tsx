import { requireRoleOrRedirect } from '@/lib/auth.server';

async function VolunteerAuthWrapper({ children }: { children: React.ReactNode }) {
  // Server-side guard: volunteer accounts only. Other roles are redirected
  // to their own dashboard, unauthenticated users to /login.
  await requireRoleOrRedirect('volunteer');

  return <>{children}</>;
}

export default function VolunteerLayout({ children }: { children: React.ReactNode }) {
  return (
    <VolunteerAuthWrapper>
      {children}
    </VolunteerAuthWrapper>
  );
}
