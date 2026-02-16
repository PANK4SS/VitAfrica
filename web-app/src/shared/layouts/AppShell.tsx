import { type PropsWithChildren } from 'react';
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Building2,
  LogOut,
  CalendarCheck2,
  Stethoscope,
  Search,
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

  const pageTitleByPath: Record<string, string> = {
    '/app/admin': 'Admin Dashboard',
    '/app/staff': 'Staff Operations',
    '/app/doctor': 'Doctor Portal',
  };

  const getPageTitle = () => {
    const base = path.split('?')[0];
    return pageTitleByPath[base] || 'VitAfrica Portal';
  };

  return (
    <div className="shell">
      <aside className="shell__sidebar">
        <header className="shell__logo" onClick={() => navigateTo('/')} style={{ justifyContent: 'center' }}>
          <img src="/logo.png" alt="VitAfrica" style={{ height: '64px', filter: 'brightness(0) invert(1)' }} />
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
        <header className="shell__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Menu className="md:hidden" size={20} style={{ color: 'var(--primary)', cursor: 'pointer' }} />
            <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--primary)' }}>{getPageTitle()}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }} className="hidden md:flex">
              <Search
                size={16}
                style={{ position: 'absolute', left: '0.75rem', color: 'var(--ink-muted)' }}
              />
              <input
                type="text"
                placeholder="Search patient record..."
                className="input-style"
                style={{ width: '240px', paddingLeft: '2.5rem', height: '36px', fontSize: '0.8125rem' }}
              />
            </div>
          </div>
        </header>

        <main className="shell__main">
          {children}
        </main>
      </div>
    </div>
  );
}
