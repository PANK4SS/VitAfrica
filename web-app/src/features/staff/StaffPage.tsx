import { useEffect, useState } from 'react';
import {
  Users,
  CalendarPlus,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  Phone,
  MapPin,
  IdCard,
  Search,
  X,
  Plus
} from 'lucide-react';
import { staffApi } from '../../core/api/staffApi';
import { useAuth } from '../../core/auth/AuthContext';
import { useHashPath } from '../../app/router';
import type {
  DoctorSummaryResponse,
  PatientSummaryResponse,
  StaffDashboardResponse,
} from '../../core/types/api';
import { StatCard } from '../../shared/components/StatCard';
import { ProfileAvatar } from '../../shared/components/ProfileAvatar';

export function StaffPage() {
  const { session } = useAuth();
  const path = useHashPath();
  const currentTab = path.includes('tab=') ? path.split('tab=')[1].split('&')[0] : 'dashboard';

  const [dashboard, setDashboard] = useState<StaffDashboardResponse | null>(null);
  const [patients, setPatients] = useState<PatientSummaryResponse[]>([]);
  const [doctors, setDoctors] = useState<DoctorSummaryResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ patientId: '', doctorId: '', dateTime: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadData = async (token: string, search?: string) => {
    try {
      const [dashboardData, patientsData, doctorsData] = await Promise.all([
        staffApi.getDashboard(token).catch(() => null),
        staffApi.getPatients(token, search).catch(() => []),
        staffApi.getDoctors(token).catch(() => []),
      ]);
      if (dashboardData) setDashboard(dashboardData);
      setPatients(patientsData);
      setDoctors(doctorsData);
    } catch (err) {
      setError('Synchronisation error with clinical records.');
    }
  };

  useEffect(() => {
    if (!session) return;
    const loadInitial = async () => {
      setLoading(true);
      await loadData(session.accessToken);
      setLoading(false);
    };
    void loadInitial();
  }, [session]);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (session) {
        void loadData(session.accessToken, searchTerm);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, session]);

  const createAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    try {
      await staffApi.createAppointment(session.accessToken, {
        patientId: Number(form.patientId),
        doctorId: Number(form.doctorId),
        dateTime: new Date(form.dateTime).toISOString(),
      });
      setMessage('Appointment successfully scheduled.');
      setForm({ patientId: '', doctorId: '', dateTime: '' });
      const dash = await staffApi.getDashboard(session.accessToken);
      setDashboard(dash);
    } catch {
      setError('Could not schedule appointment. Verify IDs.');
    }
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <p>Connecting to clinical database...</p>
      </div>
    );
  }

  return (
    <div className="page-grid" style={{ display: 'grid', gap: '2rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title">
          <h1>{currentTab === 'dashboard' ? 'Overview' : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
          <p>
            {currentTab === 'dashboard' && 'Manage patients and clinical scheduling'}
            {currentTab === 'patients' && 'Complete patient directory and registration'}
            {currentTab === 'appointments' && 'Schedule and manage medical consultations'}
          </p>
        </div>
        {currentTab === 'patients' && (
          <button className="btn btn--secondary" onClick={() => setError('Direct clinical registration available on mobile only.')}>
            <Plus size={18} /> New Patient
          </button>
        )}
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
            <StatCard label="Total Patients" value={dashboard?.totalPatients ?? 0} icon={Users} color="#6c5ce7" trend={{ value: '12 new', isUp: true }} />
            <StatCard label="Clinical Directory" value={patients.length} icon={IdCard} color="#0d6efd" />
            <StatCard label="Medical Team" value={doctors.length} icon={Stethoscope} color="#10b981" />
          </div>

          <div className="grid-2">
            <article className="table-card">
              <div className="table-header"><h3>Recent Patients</h3></div>
              <div className="table-wrap">
                <table>
                  <tbody>
                    {patients.slice(0, 5).map(p => (
                      <tr key={p.patientId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <ProfileAvatar src={p.profilePicUrl} alt={p.fullName} size={32} />
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.fullName}</div>
                              <div className="muted" style={{ fontSize: '0.75rem' }}>{p.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <span className="badge badge--success">Active</span>
                        </td>
                      </tr>
                    ))}
                    {patients.length === 0 && (
                      <tr><td className="muted" style={{ textAlign: 'center', padding: '1rem' }}>No patients found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="table-card">
              <div className="table-header"><h3>Medical Personnel</h3></div>
              <div className="table-wrap">
                <table>
                  <tbody>
                    {doctors.slice(0, 5).map(d => (
                      <tr key={d.doctorId}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                            <ProfileAvatar src={d.profilePicUrl} alt={d.fullName} size={32} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{d.fullName}</div>
                              <div className="muted" style={{ fontSize: '0.75rem' }}>#{d.doctorId} - {d.department}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button className="btn btn--ghost btn--small">Profile</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
          </div>
        </>
      )}

      {currentTab === 'appointments' && (
        <article className="table-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="table-header"><h3>New Appointment Coordination</h3></div>
          <div style={{ padding: '1.5rem' }}>
            {message && <div className="alert alert--success"><CheckCircle2 size={18} /> {message}</div>}
            <form onSubmit={createAppointment} style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-group">
                <label className="form-label">Patient Identity</label>
                <select
                  className="input-style"
                  value={form.patientId}
                  onChange={e => setForm(p => ({ ...p, patientId: e.target.value }))}
                  required
                >
                  <option value="">Select Patient...</option>
                  {patients.map(p => (
                    <option key={p.patientId} value={p.patientId}>{p.fullName} (#{p.patientId})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Medical Specialist</label>
                <select
                  className="input-style"
                  value={form.doctorId}
                  onChange={e => setForm(p => ({ ...p, doctorId: e.target.value }))}
                  required
                >
                  <option value="">Select Doctor...</option>
                  {doctors.map(d => (
                    <option key={d.doctorId} value={d.doctorId}>{d.fullName} ({d.department})</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Scheduled Time</label>
                <input type="datetime-local" className="input-style" value={form.dateTime} onChange={e => setForm(p => ({ ...p, dateTime: e.target.value }))} required />
              </div>
              <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
                <CalendarPlus size={20} /> Confirm Appointment
              </button>
            </form>
          </div>
        </article>
      )}

      {currentTab === 'patients' && (
        <article className="table-card">
          <div className="table-header">
            <h3>Directory</h3>
            <div style={{ position: 'relative', width: '320px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
              <input
                type="text"
                className="input-style"
                placeholder="Search patients..."
                style={{ paddingLeft: '2.5rem', height: '36px', fontSize: '0.875rem' }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Identity</th>
                  <th>Contact Information</th>
                  <th>Location</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.patientId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <ProfileAvatar src={p.profilePicUrl} alt={p.fullName} size={32} />
                        <div>
                          <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.fullName}</div>
                          <div className="muted" style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>#PAT-{p.patientId}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} className="muted" /> {p.phone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} className="muted" /> {p.locationAddress}</div>
                    </td>
                    <td><span className="badge badge--approved">Active</span></td>
                  </tr>
                ))}
                {patients.length === 0 && (
                  <tr><td colSpan={4} className="muted" style={{ textAlign: 'center', padding: '2rem' }}>No patients found matching your search.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </div>
  );
}
