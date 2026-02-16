import { useMemo } from 'react';
import { useAuth } from '../core/auth/AuthContext';
import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { AdminPage } from '../features/admin/AdminPage';
import { ConsultationDetailPage } from '../features/doctor/ConsultationDetailPage';
import { DoctorPage } from '../features/doctor/DoctorPage';
import { LandingPage } from '../features/public/LandingPage';
import { NotFoundPage } from '../features/public/NotFoundPage';
import { StaffPage } from '../features/staff/StaffPage';
import { AppShell } from '../shared/layouts/AppShell';
import { navigateTo, useHashPath } from './router';

function parseDoctorConsultationPath(path: string): number | null {
  const match = path.match(/^\/app\/doctor\/consultations\/(\d+)$/);
  if (!match) return null;

  return Number(match[1]);
}

export function AppRouter() {
  const path = useHashPath();
  const { isAuthenticated, role } = useAuth();

  const page = useMemo(() => {
    if (path === '/') return <LandingPage />;
    if (path === '/login') return <LoginPage />;
    if (path === '/register') return <RegisterPage />;

    if (path.startsWith('/app')) {
      if (!isAuthenticated) {
        navigateTo('/login');
        return null;
      }

      if (path.startsWith('/app/admin')) {
        if (role !== 'ADMIN') {
          return <NotFoundPage title="Access denied" description="This area is restricted to admins." />;
        }

        return (
          <AppShell>
            <AdminPage />
          </AppShell>
        );
      }

      if (path.startsWith('/app/staff')) {
        if (role !== 'STAFF') {
          return <NotFoundPage title="Access denied" description="This area is restricted to staff." />;
        }

        return (
          <AppShell>
            <StaffPage />
          </AppShell>
        );
      }

      if (path.startsWith('/app/doctor')) {
        if (role !== 'DOCTOR') {
          return <NotFoundPage title="Access denied" description="This area is restricted to doctors." />;
        }

        const appointmentId = parseDoctorConsultationPath(path);

        return (
          <AppShell>
            {appointmentId ? <ConsultationDetailPage appointmentId={appointmentId} /> : <DoctorPage />}
          </AppShell>
        );
      }

      if (path === '/app/unknown-role') {
        return (
          <NotFoundPage
            title="Unsupported role"
            description="Your account does not yet have a usable web role (ADMIN/STAFF/DOCTOR)."
          />
        );
      }

      return <NotFoundPage />;
    }

    return <NotFoundPage />;
  }, [path, isAuthenticated, role]);

  return page;
}
