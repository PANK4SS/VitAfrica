import { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Search,
  AlertCircle,
  X
} from 'lucide-react';
import { navigateTo, useHashPath } from '../../app/router';
import { doctorApi } from '../../core/api/doctorApi';
import { useAuth } from '../../core/auth/AuthContext';
import type {
  ConsultationSummaryResponse,
  DoctorDashboardResponse,
} from '../../core/types/api';
import { StatCard } from '../../shared/components/StatCard';
import { StatusPill } from '../../shared/components/StatusPill';

export function DoctorPage() {
  const { session } = useAuth();
  const path = useHashPath();
  const currentTab = path.includes('tab=') ? path.split('tab=')[1].split('&')[0] : 'dashboard';

  const [dashboard, setDashboard] = useState<DoctorDashboardResponse | null>(null);
  const [consultations, setConsultations] = useState<ConsultationSummaryResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!session) return;
    const token = session.accessToken;

    async function load() {
      setLoading(true);
      try {
        const [dashData, consultationsData] = await Promise.all([
          doctorApi.getDashboard(token).catch(() => null),
          doctorApi.getConsultations(token).catch(() => []),
        ]);
        if (dashData) setDashboard(dashData);
        setConsultations(consultationsData);
      } catch (err) {
        setError('Unable to fetch clinical schedules.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [session]);

  const ongoingConsultations = consultations.filter(c => c.status === 'PENDING');
  const finishedConsultations = consultations.filter(c => c.status !== 'PENDING');

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <p>Retrieving clinical records...</p>
      </div>
    );
  }

  return (
    <div className="page-grid" style={{ display: 'grid', gap: '2rem' }}>
      <header className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-title">
          <h1>{currentTab === 'dashboard' ? 'Medical Overview' : currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}</h1>
          <p>
            {currentTab === 'dashboard' && 'Manage your clinical queue and daily patient operations'}
            {currentTab === 'consultations' && 'Active medical sessions and patient interactions'}
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
            <StatCard label="Upcoming Visits" value={dashboard?.upcomingConsultations ?? 0} icon={Calendar} color="#3b82f6" trend={{ value: 'today', isUp: true }} />
            <StatCard label="Completed Files" value={dashboard?.completedConsultations ?? 0} icon={CheckCircle2} color="#10b981" />
            <StatCard label="Clinical Hours" value="6.5h" icon={Clock} color="#6c5ce7" />
          </div>

          <div className="grid-2">
            <article className="table-card">
              <div className="table-header">
                <h3>Immediate Agenda</h3>
              </div>
              <div className="table-wrap">
                <table>
                  <tbody>
                    {ongoingConsultations.slice(0, 3).map(c => (
                      <tr key={c.appointmentId}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{c.patientName}</div>
                          <div className="muted" style={{ fontSize: '0.75rem' }}>{c.hour} - Consultation</div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn btn--secondary btn--small"
                            onClick={() => navigateTo(`/app/doctor/consultations/${c.appointmentId}`)}
                          >
                            Start
                          </button>
                        </td>
                      </tr>
                    ))}
                    {ongoingConsultations.length === 0 && (
                      <tr><td className="muted" style={{ textAlign: 'center', padding: '1.5rem' }}>No pending visits</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <article className="table-card">
              <div className="table-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="table-wrap">
                <table>
                  <tbody>
                    {finishedConsultations.slice(0, 3).map(c => (
                      <tr key={c.appointmentId}>
                        <td>
                          <div style={{ fontWeight: 600 }}>{c.patientName}</div>
                          <div className="muted" style={{ fontSize: '0.75rem' }}>Completed at {c.hour}</div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <StatusPill value="FINISHED" />
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

      {currentTab === 'consultations' && (
        <article className="table-card">
          <div className="table-header">
            <h3>Consultation Queue</h3>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
              <input type="text" className="input-style" placeholder="Patient name or ID..." style={{ paddingLeft: '2.5rem', height: '36px', fontSize: '0.875rem' }} />
            </div>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Patient identity</th>
                  <th>Clinical Status</th>
                  <th>Schedule</th>
                  <th>Operation</th>
                </tr>
              </thead>
              <tbody>
                {consultations.map(c => (
                  <tr key={c.appointmentId}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{c.patientName}</div>
                      <div className="muted" style={{ fontSize: '0.75rem' }}>ID: #{c.appointmentId}</div>
                    </td>
                    <td><StatusPill value={c.status} /></td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{c.date}</div>
                      <div className="muted" style={{ fontSize: '0.75rem' }}>{c.hour}</div>
                    </td>
                    <td>
                      <button
                        className={`btn ${c.status === 'PENDING' ? 'btn--secondary' : 'btn--ghost'}`}
                        onClick={() => navigateTo(`/app/doctor/consultations/${c.appointmentId}`)}
                      >
                        {c.status === 'PENDING' ? 'Open Case' : 'View File'}
                        <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </div>
  );
}
