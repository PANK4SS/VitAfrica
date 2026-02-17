import { useEffect, useMemo, useRef, useState } from 'react';
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
} from 'lucide-react';
import { staffApi } from '../../core/api/staffApi';
import { useAuth } from '../../core/auth/AuthContext';
import { navigateTo, useHashPath } from '../../app/router';
import type {
  DoctorSummaryResponse,
  PatientSummaryResponse,
  StaffDashboardResponse,
} from '../../core/types/api';
import { StatCard } from '../../shared/components/StatCard';
import { ProfileAvatar } from '../../shared/components/ProfileAvatar';
import { WelcomeBanner } from '../../shared/components/WelcomeBanner';

export function StaffPage() {
  const { session } = useAuth();
  const path = useHashPath();
  const url = useMemo(() => new URL(path, 'http://vitafrica.local'), [path]);
  const currentTab = url.searchParams.get('tab') || 'dashboard';
  const requestedPatientId = url.searchParams.get('patientId') || '';
  const focus = url.searchParams.get('focus') || '';

  const [dashboard, setDashboard] = useState<StaffDashboardResponse | null>(null);
  const [patients, setPatients] = useState<PatientSummaryResponse[]>([]);
  const [doctors, setDoctors] = useState<DoctorSummaryResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({ patientId: '', doctorId: '', dateTime: '' });
  const [vitalsForm, setVitalsForm] = useState({
    patientId: '',
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: '',
  });
  const [message, setMessage] = useState('');
  const [vitalsMessage, setVitalsMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const vitalsSectionRef = useRef<HTMLElement | null>(null);

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

  // If we navigated here with a patientId, pre-fill Patient in both forms.
  useEffect(() => {
    if (!requestedPatientId) return;
    setForm(p => (p.patientId === requestedPatientId ? p : { ...p, patientId: requestedPatientId }));
    setVitalsForm(v => (v.patientId === requestedPatientId ? v : { ...v, patientId: requestedPatientId }));
  }, [requestedPatientId]);

  // Deep-link focus on vital signs section.
  useEffect(() => {
    if (currentTab !== 'appointments') return;
    if (focus !== 'vitals') return;
    window.setTimeout(() => {
      vitalsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }, [currentTab, focus]);

  // Lightweight polling so staff dashboards stay in sync without manual refresh.
  useEffect(() => {
    if (!session) return;
    const token = session.accessToken;

    const intervalId = window.setInterval(() => {
      void loadData(token, searchTerm);
    }, 20000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [session, searchTerm]);

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
      setVitalsMessage('');
      setForm({ patientId: '', doctorId: '', dateTime: '' });
      const dash = await staffApi.getDashboard(session.accessToken);
      setDashboard(dash);
    } catch {
      setError('Could not schedule appointment. Verify IDs.');
    }
  };

  const recordVitals = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    const selectedPatientId = vitalsForm.patientId;
    if (!selectedPatientId) {
      setError('Select a patient to record vital signs.');
      return;
    }

    try {
      await staffApi.recordVitalSigns(session.accessToken, {
        patientId: Number(selectedPatientId),
        bloodPressure: vitalsForm.bloodPressure.trim(),
        heartRate: Number(vitalsForm.heartRate),
        temperature: Number(vitalsForm.temperature),
        weight: Number(vitalsForm.weight),
      });
      setVitalsMessage('Vital signs saved successfully.');
      setMessage('');
      setVitalsForm({
        patientId: '',
        bloodPressure: '',
        heartRate: '',
        temperature: '',
        weight: '',
      });
      // Clear error if success
      setError('');
    } catch {
      setError('Could not save vital signs. Ensure all values are numeric.');
    }
  };

  const takeVitalSigns = (patientId: number) => {
    const id = String(patientId);
    setForm(p => ({ ...p, patientId: id }));
    setVitalsForm(v => ({ ...v, patientId: id }));
    navigateTo(`/app/staff?tab=appointments&focus=vitals&patientId=${encodeURIComponent(id)}`);
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
            role="STAFF"
            name={session?.clientName || 'Staff Member'}
            text="Gérez le flux des patients et facilitez leur parcours de soin."
          />
          <div className="stats-grid">
            <StatCard label="Total Patients" value={dashboard?.totalPatients ?? 0} icon={Users} color="var(--primary)" />
            <StatCard label="Clinical Directory" value={patients.length} icon={IdCard} color="var(--primary)" />
            <StatCard label="Medical Team" value={doctors.length} icon={Stethoscope} color="var(--primary)" />
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
                              <div className="muted" style={{ fontSize: '0.75rem' }}>{d.department}</div>
                            </div>
                          </div>
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
        <div style={{ display: 'grid', gap: '2rem' }}>
          <section className="table-card">
            <div className="table-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CalendarPlus size={20} /> Schedule consultation
              </h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {message && (
                <div className="alert alert--success" style={{ marginBottom: '1.5rem' }}>
                  <CheckCircle2 size={18} />
                  {message}
                </div>
              )}
              <form onSubmit={createAppointment} style={{ display: 'grid', gap: '1.25rem' }}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Patient</label>
                    <select
                      className="input-style"
                      value={form.patientId}
                      onChange={e => {
                        const value = e.target.value;
                        setForm(p => ({ ...p, patientId: value }));
                        setVitalsForm(v => ({ ...v, patientId: value }));
                      }}
                      required
                    >
                      <option value="">Select patient...</option>
                      {patients.map(p => (
                        <option key={p.patientId} value={p.patientId}>{p.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Doctor</label>
                    <select
                      className="input-style"
                      value={form.doctorId}
                      onChange={e => setForm(p => ({ ...p, doctorId: e.target.value }))}
                      required
                    >
                      <option value="">Select doctor...</option>
                      {doctors.map(d => (
                        <option key={d.doctorId} value={d.doctorId}>{d.fullName} ({d.department})</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Date & time</label>
                  <input
                    type="datetime-local"
                    className="input-style"
                    value={form.dateTime}
                    onChange={e => setForm(p => ({ ...p, dateTime: e.target.value }))}
                    required
                  />
                </div>
                <button type="submit" className="btn btn--primary" style={{ width: '100%' }}>
                  Confirm appointment
                </button>
              </form>
            </div>
          </section>

          <section className="table-card" ref={(el) => { vitalsSectionRef.current = el; }}>
            <div className="table-header">
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Stethoscope size={20} /> Record vital signs
              </h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              {vitalsMessage && (
                <div className="alert alert--success" style={{ marginBottom: '1.5rem' }}>
                  <CheckCircle2 size={18} />
                  {vitalsMessage}
                </div>
              )}
              <form onSubmit={recordVitals} style={{ display: 'grid', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Patient</label>
                  <select
                    className="input-style"
                    value={vitalsForm.patientId}
                    onChange={e => {
                      const value = e.target.value;
                      setVitalsForm(v => ({ ...v, patientId: value }));
                      setForm(p => ({ ...p, patientId: value }));
                    }}
                    required
                  >
                    <option value="">Select a patient...</option>
                    {patients.map(p => (
                      <option key={p.patientId} value={p.patientId}>{p.fullName}</option>
                    ))}
                  </select>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Blood pressure</label>
                    <input
                      className="input-style"
                      placeholder="e.g. 120/80"
                      value={vitalsForm.bloodPressure}
                      onChange={e => setVitalsForm(v => ({ ...v, bloodPressure: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Heart rate (bpm)</label>
                    <input
                      className="input-style"
                      type="number"
                      min={0}
                      value={vitalsForm.heartRate}
                      onChange={e => setVitalsForm(v => ({ ...v, heartRate: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Temperature (°C)</label>
                    <input
                      className="input-style"
                      type="number"
                      step="0.1"
                      value={vitalsForm.temperature}
                      onChange={e => setVitalsForm(v => ({ ...v, temperature: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      className="input-style"
                      type="number"
                      step="0.1"
                      value={vitalsForm.weight}
                      onChange={e => setVitalsForm(v => ({ ...v, weight: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                <button type="submit" className="btn btn--secondary" style={{ width: '100%' }}>
                  Save vital signs
                </button>
              </form>
            </div>
          </section>
        </div>
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
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {patients.map(p => (
                  <tr key={p.patientId}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                        <ProfileAvatar src={p.profilePicUrl} alt={p.fullName} size={32} />
                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{p.fullName}</div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Phone size={14} className="muted" /> {p.phone}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={14} className="muted" /> {p.locationAddress}</div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn--secondary"
                        style={{ padding: '0.45rem 0.75rem', fontSize: '0.875rem' }}
                        onClick={() => takeVitalSigns(p.patientId)}
                      >
                        Take vital signs
                      </button>
                    </td>
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
