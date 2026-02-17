import { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  Plus,
  AlertCircle,
  Search,
  X,
  Trash2,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { navigateTo } from '../../app/router';
import { adminApi } from '../../core/api/adminApi';
import { useAuth } from '../../core/auth/AuthContext';
import { useHashPath } from '../../app/router';
import type {
  AdminDashboardResponse,
  DepartmentResponse,
  PendingRequestResponse,
  PersonnelResponse,
} from '../../core/types/api';
import { StatCard } from '../../shared/components/StatCard';
import { StatusPill } from '../../shared/components/StatusPill';
import { ProfileAvatar } from '../../shared/components/ProfileAvatar';
import { WelcomeBanner } from '../../shared/components/WelcomeBanner';

export function AdminPage() {
  const { session } = useAuth();
  const path = useHashPath();

  // Extract tab from hash query string if any
  const currentTab = path.includes('tab=') ? path.split('tab=')[1].split('&')[0] : 'dashboard';

  const [stats, setStats] = useState<AdminDashboardResponse | null>(null);
  const [requests, setRequests] = useState<PendingRequestResponse[]>([]);
  const [personnel, setPersonnel] = useState<PersonnelResponse[]>([]);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [departmentName, setDepartmentName] = useState('');
  const [personnelSearch, setPersonnelSearch] = useState('');
  const [personnelRoleFilter, setPersonnelRoleFilter] = useState<string>('all');
  const [personnelDeptFilter, setPersonnelDeptFilter] = useState<string>('all');

  // Local state for approval modal
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [approvalRole, setApprovalRole] = useState('STAFF');
  const [approvalDept, setApprovalDept] = useState('');
  const [showDeptPopup, setShowDeptPopup] = useState(false);
  const [newDeptNameInModal, setNewDeptNameInModal] = useState('');

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const token = session.accessToken;

    async function load() {
      setLoading(true);
      try {
        const [statsData, requestsData, personnelData, departmentsData] = await Promise.all([
          adminApi.getStats(token).catch(() => null),
          adminApi.getPendingRequests(token).catch(() => []),
          adminApi.getPersonnel(token).catch(() => []),
          adminApi.getDepartments(token).catch(() => []),
        ]);

        if (statsData) setStats(statsData);
        setRequests(requestsData);
        setPersonnel(personnelData);
        setDepartments(departmentsData);
        if (departmentsData.length > 0) setApprovalDept(departmentsData[0].name);
      } catch (err) {
        setError('Failed to load administrative data');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [session]);

  useEffect(() => {
    if (!session) return;
    if (currentTab !== 'personnel') return;
    const timer = setTimeout(async () => {
      try {
        const data = await adminApi.getPersonnel(session.accessToken, {
          search: personnelSearch,
        });
        setPersonnel(data);
      } catch {
        setError('Unable to search personnel');
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [session, personnelSearch, currentTab]);

  const approve = async () => {
    if (!session || !approvingId) return;
    try {
      await adminApi.approveRequest(session.accessToken, approvingId, {
        role: approvalRole,
        department: approvalRole === 'DOCTOR' ? approvalDept : undefined
      });
      setRequests(prev => prev.filter(r => r.profileId !== approvingId));
      setApprovingId(null);
      const statsData = await adminApi.getStats(session.accessToken);
      setStats(statsData);
    } catch {
      setError('Approval failed');
    }
  };

  const reject = async (profileId: number) => {
    if (!session) return;
    try {
      await adminApi.rejectRequest(session.accessToken, profileId);
      setRequests(prev => prev.filter(r => r.profileId !== profileId));
      const statsData = await adminApi.getStats(session.accessToken);
      setStats(statsData);
    } catch {
      setError('Rejection failed');
    }
  };

  const addDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !departmentName.trim()) return;
    try {
      await adminApi.createDepartment(session.accessToken, departmentName.trim());
      setDepartmentName('');
      const data = await adminApi.getDepartments(session.accessToken);
      setDepartments(data);
    } catch {
      setError('Department already exists');
    }
  };

  const addDepartmentFromModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !newDeptNameInModal.trim()) return;
    const nextName = newDeptNameInModal.trim();
    try {
      await adminApi.createDepartment(session.accessToken, nextName);
      setNewDeptNameInModal('');
      const data = await adminApi.getDepartments(session.accessToken);
      setDepartments(data);
      const created = data.find(d => d.name === nextName);
      if (created) setApprovalDept(created.name);
      else if (data.length > 0) setApprovalDept(data[0].name);
      setShowDeptPopup(false);
    } catch {
      setError('Department already exists');
    }
  };

  const deleteDept = async (id: number) => {
    if (!session) return;
    try {
      await adminApi.deleteDepartment(session.accessToken, id);
      setDepartments(prev => prev.filter(d => d.departmentId !== id));
    } catch {
      setError('Cannot delete department with active staff');
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <p>Synchronizing with clinical network...</p>
      </div>
    );
  }

  return (
    <div className="page-grid" style={{ display: 'grid', gap: '2rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {currentTab === 'dashboard' && (
            <button
              type="button"
              onClick={() => navigateTo('/app/admin?tab=requests')}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: '0.5rem' }}
              aria-label="Pending requests"
            >
              <Bell size={24} style={{ color: 'var(--primary)' }} />
              <span
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  minWidth: '1.25rem',
                  height: '1.25rem',
                  borderRadius: '50%',
                  background: 'var(--secondary)',
                  color: 'var(--primary-dark)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {requests.length}
              </span>
            </button>
          )}
          <h1>{currentTab === 'dashboard' ? 'Overview' : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
        </div>
      </header>

      {error && (
        <div className="alert alert--error">
          <AlertCircle size={18} />
          {error}
          <button onClick={() => setError('')} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>
      )}

      {currentTab === 'dashboard' && (
        <>
          <WelcomeBanner
            role="ADMIN"
            name={session?.clientName || 'Admin'}
            text="Supervisez l'ensemble de l'écosystème VitAfrica avec efficacité et clarté."
          />
          <div className="stats-grid">
            <StatCard label="Total Patients" value={stats?.patientNumber || 0} icon={Users} color="var(--primary)" />
            <StatCard label="Doctor Staff" value={stats?.doctorNumber || 0} icon={UserCheck} color="var(--primary)" />
            <StatCard label="Support Staff" value={stats?.staffNumber || 0} icon={Building2} color="var(--primary)" />
          </div>
        </>
      )}

      {currentTab === 'requests' && (
        <article className="table-card">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Professional</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                  <tr key={req.profileId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <ProfileAvatar src={req.profilePicUrl} alt={req.fullName} size={32} />
                        <span style={{ fontWeight: 600 }}>{req.fullName}</span>
                      </div>
                    </td>
                    <td>{req.email}</td>
                    <td><StatusPill value="PENDING" /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button className="btn btn--secondary" onClick={() => setApprovingId(req.profileId)}>
                          Verify Access
                        </button>
                        <button className="btn btn--ghost" style={{ color: 'var(--danger)' }} onClick={() => reject(req.profileId)}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={4} className="muted" style={{ textAlign: 'center', padding: '2rem' }}>No pending requests</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {/* Approval Details Inline / Modalish Overlay */}
      {approvingId && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            background: 'rgba(0,0,0,0.45)',
            backdropFilter: 'blur(6px)',
          }}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              background: 'var(--surface)',
              borderRadius: '24px',
              boxShadow: '0 24px 60px rgba(2, 2, 58, 0.22)',
              border: '1px solid rgba(4, 4, 94, 0.08)',
              padding: '2.25rem 2.25rem 1.75rem',
              animation: 'slideUp 0.3s ease',
            }}
          >
            <header className="auth-card__logo" style={{ marginBottom: '1.5rem' }}>
              <ShieldCheck size={44} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: 'var(--primary)', fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em' }}>Validate Access</h3>
              <p className="muted" style={{ maxWidth: '320px', margin: '0.25rem auto 0' }}>Assign role and clinical department</p>
            </header>

            <div style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Professional Role</label>
                <select className="input-style" value={approvalRole} onChange={e => setApprovalRole(e.target.value)}>
                  <option value="STAFF">Administrative Staff</option>
                  <option value="DOCTOR">Medical Doctor</option>
                </select>
              </div>

              {approvalRole === 'DOCTOR' && (
                <div className="form-group">
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
                    <label className="form-label" style={{ marginBottom: 0 }}>Clinical Department</label>
                    <button
                      type="button"
                      className="btn btn--ghost btn--small"
                      onClick={() => setShowDeptPopup(true)}
                      style={{ border: '1px solid rgba(4, 4, 94, 0.14)' }}
                    >
                      <Plus size={16} />
                      Add department
                    </button>
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <select
                      className="input-style"
                      value={approvalDept}
                      onChange={e => setApprovalDept(e.target.value)}
                      disabled={departments.length === 0}
                    >
                      {departments.length === 0 ? (
                        <option value="">No departments yet</option>
                      ) : (
                        departments.map(d => (
                          <option key={d.departmentId} value={d.name}>{d.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn--ghost" style={{ flex: 1 }} onClick={() => { setApprovingId(null); setNewDeptNameInModal(''); }}>Cancel</button>
                <button
                  className="btn btn--secondary"
                  style={{ flex: 1 }}
                  onClick={approve}
                  disabled={approvalRole === 'DOCTOR' && departments.length === 0}
                >
                  Confirm Verification
                </button>
              </div>
            </div>
          </div>

          {/* Department add popup */}
          {showDeptPopup && (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 2100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
              }}
              onClick={() => {
                setShowDeptPopup(false);
                setNewDeptNameInModal('');
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(0,0,0,0.25)',
                }}
              />
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '460px',
                  background: 'var(--surface)',
                  borderRadius: '22px',
                  border: '1px solid rgba(4, 4, 94, 0.1)',
                  boxShadow: '0 24px 60px rgba(2, 2, 58, 0.18)',
                  padding: '1.75rem',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <h3 style={{ color: 'var(--primary)', fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.25rem' }}>
                      Add department
                    </h3>
                    <p className="muted" style={{ fontSize: '0.85rem' }}>
                      Create a new clinical department and continue verification.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowDeptPopup(false);
                      setNewDeptNameInModal('');
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                <form onSubmit={addDepartmentFromModal} style={{ display: 'grid', gap: '1rem', marginTop: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label">Department name</label>
                    <input
                      className="input-style"
                      placeholder="e.g. Cardiology"
                      value={newDeptNameInModal}
                      onChange={e => setNewDeptNameInModal(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                    <button
                      type="button"
                      className="btn btn--ghost"
                      style={{ flex: 1, border: '1px solid rgba(4, 4, 94, 0.14)' }}
                      onClick={() => {
                        setShowDeptPopup(false);
                        setNewDeptNameInModal('');
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn--secondary" style={{ flex: 1 }}>
                      <Plus size={18} />
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {currentTab === 'personnel' && (() => {
        const uniqueRoles = Array.from(new Set(personnel.map(p => p.role))).sort();
        const uniqueDepartments = Array.from(new Set(personnel.map(p => p.department || 'N/A').filter(d => d))).sort();
        const filteredPersonnel = personnel.filter(p => {
          const matchesSearch = !personnelSearch.trim() || p.fullName.toLowerCase().includes(personnelSearch.trim().toLowerCase()) || p.email.toLowerCase().includes(personnelSearch.trim().toLowerCase());
          const matchesRole = personnelRoleFilter === 'all' || p.role === personnelRoleFilter;
          const matchesDept = personnelDeptFilter === 'all' || (p.department || 'N/A') === personnelDeptFilter;
          return matchesSearch && matchesRole && matchesDept;
        });

        return (
          <article className="table-card">
            <div className="table-header">
              <h3>Active Clinical Personnel</h3>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                <input
                  type="text"
                  className="input-style"
                  placeholder="Search staff..."
                  style={{ paddingLeft: '2.5rem', height: '36px', fontSize: '0.875rem' }}
                  value={personnelSearch}
                  onChange={e => setPersonnelSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>
                      <select
                        className="input-style"
                        value={personnelRoleFilter}
                        onChange={e => setPersonnelRoleFilter(e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', border: 'none', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <option value="all">Professional Role</option>
                        {uniqueRoles.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </th>
                    <th>
                      <select
                        className="input-style"
                        value={personnelDeptFilter}
                        onChange={e => setPersonnelDeptFilter(e.target.value)}
                        style={{ fontSize: '0.875rem', padding: '0.5rem', border: 'none', background: 'transparent', fontWeight: 600, cursor: 'pointer' }}
                      >
                        <option value="all">Department</option>
                        {uniqueDepartments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </th>
                    <th>Email</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPersonnel.map(p => (
                    <tr key={p.clientId}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <ProfileAvatar src={p.profilePicUrl} alt={p.fullName} size={32} />
                          <span style={{ fontWeight: 600 }}>{p.fullName}</span>
                        </div>
                      </td>
                      <td><span className="badge badge--approved">{p.role}</span></td>
                      <td><span className="muted">{p.department || 'N/A'}</span></td>
                      <td>{p.email}</td>
                      <td>
                        <button
                          className="btn btn--ghost"
                          style={{ color: 'var(--danger)', padding: '0.4rem' }}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to remove ${p.fullName} from the personnel?`)) {
                              if (!session) return;
                              void adminApi.deletePersonnel(session.accessToken, p.clientId).then(() => {
                                setPersonnel(prev => prev.filter(per => per.clientId !== p.clientId));
                              }).catch(() => {
                                setError('Failed to remove personnel member');
                              });
                            }
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPersonnel.length === 0 && (
                    <tr><td colSpan={4} className="muted" style={{ textAlign: 'center', padding: '2rem' }}>No personnel match the filters</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </article>
        );
      })()}

      {currentTab === 'departments' && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            <article className="table-card">
              <div className="table-header">
                <h3>New Department</h3>
              </div>
              <form onSubmit={addDepartment} style={{ padding: '1.5rem', display: 'flex', gap: '1rem' }}>
                <input
                  className="input-style"
                  placeholder="e.g. Cardiology"
                  value={departmentName}
                  onChange={e => setDepartmentName(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn--primary"><Plus size={20} /> Add</button>
              </form>
            </article>
            <article className="table-card">
              <div className="table-header">
                <h3>Total Departments</h3>
              </div>
              <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--primary)' }}>{departments.length}</div>
              </div>
            </article>
          </div>

          <article className="table-card">
            <div className="table-header">
              <h3>Infrastructure Hierarchy</h3>
            </div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Staffing</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {departments.map(dept => (
                    <tr key={dept.departmentId}>
                      <td style={{ fontWeight: 600 }}>{dept.name}</td>
                      <td>{dept.doctorCount} doctor(s)</td>
                      <td>
                        <button className="btn btn--ghost" style={{ color: 'var(--danger)', padding: '0.5rem' }} onClick={() => deleteDept(dept.departmentId)}>
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
