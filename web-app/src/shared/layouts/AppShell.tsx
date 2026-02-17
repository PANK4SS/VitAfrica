import { type PropsWithChildren } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  LogOut,
  CalendarCheck2,
  Stethoscope,
  Menu
} from 'lucide-react';
import { useAuth } from '../../core/auth/AuthContext';
import type { UserRole } from '../../core/types/domain';
import { navigateTo, useHashPath } from '../../app/router';
import { ProfileAvatar } from '../components/ProfileAvatar';

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

const navByRole: Record<'ADMIN' | 'STAFF' | 'DOCTOR', NavItem[]> = {
  ADMIN: [
    { label: 'Dashboard', href: '/app/admin', icon: LayoutDashboard },
    { label: 'Requests', href: '/app/admin?tab=requests', icon: ClipboardList },
    { label: 'Personnel', href: '/app/admin?tab=personnel', icon: Users },
    { label: 'Departments', href: '/app/admin?tab=departments', icon: Building2 },
  ],
  STAFF: [
    { label: 'Dashboard', href: '/app/staff', icon: LayoutDashboard },
    { label: 'Patients', href: '/app/staff?tab=patients', icon: Users },
    { label: 'Appointments', href: '/app/staff?tab=appointments', icon: CalendarCheck2 },
  ],
  DOCTOR: [
    { label: 'Dashboard', href: '/app/doctor', icon: LayoutDashboard },
    { label: 'Consultations', href: '/app/doctor?tab=consultations', icon: Stethoscope },
  ],
};

function isRoleWithMenu(role: UserRole): role is keyof typeof navByRole {
  return role === 'ADMIN' || role === 'STAFF' || role === 'DOCTOR';
}

export function AppShell({ children }: PropsWithChildren) {
  const { session, role, logout } = useAuth();
  const path = useHashPath();

  const menu = isRoleWithMenu(role) ? navByRole[role] : [];

  // Check if we're on a dashboard (no tab parameter)
  const isDashboard = path === '/app/admin' || path === '/app/staff' || path === '/app/doctor';
  const isAdminRequestsPersonnelDepartments =
    path.startsWith('/app/admin') &&
    (path.includes('tab=requests') || path.includes('tab=personnel') || path.includes('tab=departments'));
  const isDoctorConsultationsOrDetail =
    path.startsWith('/app/doctor') && (path.includes('tab=consultations') || /^\/app\/doctor\/consultations\/\d+$/.test(path.split('?')[0]));
  const isStaffPatientsOrAppointments =
    path.startsWith('/app/staff') && (path.includes('tab=patients') || path.includes('tab=appointments'));
  const showHeader = !isDashboard && !isAdminRequestsPersonnelDepartments && !isDoctorConsultationsOrDetail && !isStaffPatientsOrAppointments;

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <header className="shell__logo" onClick={() => navigateTo('/')} style={{ justifyContent: 'center', padding: '0 2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white', letterSpacing: '-0.02em', cursor: 'pointer' }}>
            Vit<span style={{ color: 'var(--secondary)' }}>Africa</span>
          </h2>
        </header>

        <section className="shell__user">
          <ProfileAvatar src={session?.profilePicUrl} alt="User" className="shell__user-avatar" size={44} />
          <div className="shell__user-info">
            <h4>{session?.clientName || 'Dr. Professional'}</h4>
            <p>{role.toLowerCase().replace('_', ' ')}</p>
          </div>
        </section>

        <nav className="shell__nav">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = path === item.href || (item.href === path.split('?')[0] && !path.includes('tab=') && !item.href.includes('tab='));
            return (
              <button
                key={item.href}
                className={`shell__nav-item ${isActive ? 'active' : ''}`}
                onClick={() => navigateTo(item.href)}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <footer className="shell__footer">
          <button
            className="shell__nav-item"
            style={{ color: '#fda4af' }}
            onClick={() => {
              void logout();
              navigateTo('/login');
            }}
          >
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </footer>
      </aside>

      <div className="shell__content">
        {showHeader && (
          <header className="shell__header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem', color: 'var(--ink-muted)' }}>
              <Menu className="md:hidden" size={20} style={{ color: 'var(--primary)', cursor: 'pointer' }} />
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--line)' }}>
                <div style={{ textAlign: 'right', display: 'none' }} className="hidden sm:block">
                  <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>{session?.clientName || 'User'}</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>{role?.toUpperCase() || 'ROLE'}</p>
                </div>
                <ProfileAvatar src={session?.profilePicUrl} alt="User" size={40} />
              </div>
            </div>
          </header>
        )}

        <main className="shell__main">
          {children}
        </main>
      </div>
    </div>
  );
}
