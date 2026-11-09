import { requireRoleOrRedirect } from '@/lib/auth.server';

async function VolunteerAuthWrapper({ children }: { children: React.ReactNode }) {
  await requireRoleOrRedirect('volunteer');
  return <>{children}</>;
}

export default function NotificationsPage() {
  return (
    <VolunteerAuthWrapper>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <p className="text-gray-600 mt-2">Notifications page - UI to be built</p>
      </div>
    </VolunteerAuthWrapper>
  );
}
