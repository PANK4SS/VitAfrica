import { useEffect, useState } from 'react';
import {
  Users,
  UserCheck,
  Building2,
  Hourglass,
  Plus,
  AlertCircle,
  Search,
  Check,
  X,
  Trash2,
  ShieldCheck
} from 'lucide-react';
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

  // Local state for approval modal
  const [approvingId, setApprovingId] = useState<number | null>(null);
  const [approvalRole, setApprovalRole] = useState('STAFF');
  const [approvalDept, setApprovalDept] = useState('');

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
        <div className="page-title">
          <h1>{currentTab === 'dashboard' ? 'Overview' : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
          <p>
            {currentTab === 'dashboard' && 'Real-time metrics for VitAfrica operations'}
            {currentTab === 'requests' && 'Review and validate professional access requests'}
            {currentTab === 'personnel' && 'Management of all clinical and administrative staff'}
            {currentTab === 'departments' && 'Operational departments and specialties'}
          </p>
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
          <div className="stats-grid">
            <StatCard label="Total Patients" value={stats?.patientNumber || 0} icon={Users} color="#6c5ce7" trend={{ value: '8% increase', isUp: true }} />
            <StatCard label="Doctor Staff" value={stats?.doctorNumber || 0} icon={UserCheck} color="#10b981" trend={{ value: 'new today', isUp: true }} />
            <StatCard label="Support Staff" value={stats?.staffNumber || 0} icon={Building2} color="#0284c7" />
            <StatCard label="Validations" value={stats?.waitingRequestNumber || 0} icon={Hourglass} color="#f59e0b" />
          </div>

          <div className="grid-2">
            <article className="table-card">
              <div className="table-header">
                <h3>Latest Requests</h3>
                <span className="badge badge--pending">{requests.length} pending</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Profile</th>
                      <th>Email</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.slice(0, 5).map(req => (
                      <tr key={req.profileId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <ProfileAvatar src={req.profilePicUrl} alt={req.fullName} size={32} />
                            <span style={{ fontWeight: 600, color: 'var(--primary)' }}>{req.fullName}</span>
                          </div>
                        </td>
                        <td>{req.email}</td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn btn--secondary" style={{ padding: '0.4rem', borderRadius: '6px' }} onClick={() => setApprovingId(req.profileId)}>
                              <Check size={16} />
                            </button>
                            <button className="btn btn--ghost" style={{ padding: '0.4rem', borderRadius: '6px', color: 'var(--danger)' }} onClick={() => reject(req.profileId)}>
                              <X size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {requests.length === 0 && (
                      <tr><td colSpan={3} className="muted" style={{ textAlign: 'center', padding: '2rem' }}>No pending requests</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="table-card">
              <div className="table-header">
                <h3>Departmental Map</h3>
                <span className="badge badge--approved">{departments.length} active</span>
              </div>
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Department Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departments.slice(0, 5).map(dept => (
                      <tr key={dept.departmentId}>
                        <td style={{ fontWeight: 600 }}>{dept.name}</td>
                        <td><span className="badge badge--approved">Active</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </>
      )}

      {(currentTab === 'requests' || approvingId) && (
        <article className="table-card">
          <div className="table-header">
            <h3>Credential Validations</h3>
          </div>
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
                  <tr key={req.profileId} style={{ background: approvingId === req.profileId ? 'var(--surface-muted)' : 'transparent' }}>
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
                          {approvingId === req.profileId ? 'Reviewing...' : 'Verify Access'}
                        </button>
                        <button className="btn btn--ghost" style={{ color: 'var(--danger)' }} onClick={() => reject(req.profileId)}>Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {/* Approval Details Inline / Modalish Overlay */}
      {approvingId && (
        <div className="loading-overlay" style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}>
          <div className="auth-card" style={{ maxWidth: '400px', width: '90%', animation: 'slideUp 0.3s ease' }}>
            <header className="auth-card__logo" style={{ marginBottom: '1.5rem' }}>
              <ShieldCheck size={48} color="var(--secondary)" style={{ marginBottom: '1rem' }} />
              <h3>Validate Access</h3>
              <p className="muted">Assign role and clinical department</p>
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
                  <label className="form-label">Clinical Department</label>
                  <select className="input-style" value={approvalDept} onChange={e => setApprovalDept(e.target.value)}>
                    {departments.map(d => (
                      <option key={d.departmentId} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn--ghost" style={{ flex: 1 }} onClick={() => setApprovingId(null)}>Cancel</button>
                <button className="btn btn--secondary" style={{ flex: 1 }} onClick={approve}>Confirm Verification</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentTab === 'personnel' && (
        <article className="table-card">
          <div className="table-header">
            <h3>Active Clinical Personnel</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
              <input type="text" className="input-style" placeholder="Search staff..." style={{ paddingLeft: '2.5rem', height: '36px', fontSize: '0.875rem' }} />
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Professional Role</th>
                  <th>Department</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {personnel.map(p => (
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
                    <td><StatusPill value="ACTIVE" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}

      {currentTab === 'departments' && (
        <div style={{ display: 'grid', gap: '2rem' }}>
          <article className="table-card" style={{ maxWidth: '600px' }}>
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
