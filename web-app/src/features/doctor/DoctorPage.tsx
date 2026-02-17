import { useEffect, useState } from 'react';
import {
  Calendar,
  CheckCircle2,
  ExternalLink,
  Search as SearchIcon,
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
import { ProfileAvatar } from '../../shared/components/ProfileAvatar';
import { StatCard } from '../../shared/components/StatCard';
import { StatusPill } from '../../shared/components/StatusPill';
import { WelcomeBanner } from '../../shared/components/WelcomeBanner';

type ConsultationSummaryApiVariant = ConsultationSummaryResponse & {
  patientProfilePicUrl?: string | null;
  profilePicUrl?: string | null;
};

function normalizePatientProfilePic(consultation: ConsultationSummaryApiVariant): ConsultationSummaryResponse {
  return {
    ...consultation,
    patientProfilePic:
      consultation.patientProfilePic ??
      consultation.patientProfilePicUrl ??
      consultation.profilePicUrl ??
      null,
  };
}

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

    async function load(withLoading: boolean) {
      if (withLoading) {
        setLoading(true);
      }
      try {
        const [dashData, consultationsData] = await Promise.all([
          doctorApi.getDashboard(token).catch(() => null),
          doctorApi.getConsultations(token).catch(() => []),
        ]);
        if (dashData) setDashboard(dashData);
        setConsultations(
          consultationsData.map((consultation) =>
            normalizePatientProfilePic(consultation as ConsultationSummaryApiVariant),
          ),
        );
      } catch (err) {
        setError('Unable to fetch clinical schedules.');
      } finally {
        if (withLoading) {
          setLoading(false);
        }
      }
    }

    // Initial load
    void load(true);

    // Lightweight polling so doctors see new appointments/updates without refreshing.
    const intervalId = window.setInterval(() => {
      void load(false);
    }, 15000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [session]);

  const ongoingConsultations = consultations.filter(c => c.status !== 'COMPLETED');
  const finishedConsultations = consultations.filter(c => c.status === 'COMPLETED');

  const [consultationStatusFilter, setConsultationStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [consultationSearch, setConsultationSearch] = useState('');
  const statusFiltered =
    consultationStatusFilter === 'all'
      ? consultations
      : consultationStatusFilter === 'completed'
        ? consultations.filter(c => c.status === 'COMPLETED')
        : consultations.filter(c => c.status !== 'COMPLETED');
  const filteredConsultations = consultationSearch.trim()
    ? statusFiltered.filter(c => c.patientName.toLowerCase().includes(consultationSearch.trim().toLowerCase()))
    : statusFiltered;

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
            role="DOCTOR"
            name={session?.clientName || 'Doctor'}
            text="Concentrez-vous sur les soins, nous gérons le reste."
          />
          <div className="stats-grid">
            <StatCard label="Upcoming Visits" value={dashboard?.upcomingConsultations ?? 0} icon={Calendar} color="var(--primary)" />
            <StatCard label="Completed Files" value={dashboard?.completedConsultations ?? 0} icon={CheckCircle2} color="var(--primary)" />
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
                          <div>
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{c.patientName}</div>
                              <div className="muted" style={{ fontSize: '0.75rem' }}>{c.hour} - Consultation</div>
                            </div>
                          </div>
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
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <ProfileAvatar src={c.patientProfilePic} alt={c.patientName} size={36} />
                            <div>
                              <div style={{ fontWeight: 600 }}>{c.patientName}</div>
                              <div className="muted" style={{ fontSize: '0.75rem' }}>Completed at {c.hour}</div>
                            </div>
                          </div>
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
          <div className="table-header" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
            <h3>Consultation Queue</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <SearchIcon size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                <input
                  type="text"
                  className="input-style"
                  placeholder="Search patients..."
                  value={consultationSearch}
                  onChange={(e) => setConsultationSearch(e.target.value)}
                  style={{ paddingLeft: '2.25rem', height: '36px', fontSize: '0.875rem', minWidth: '200px' }}
                />
              </div>
              {(['all', 'pending', 'completed'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  className={`btn btn--small ${consultationStatusFilter === value ? 'btn--secondary' : 'btn--ghost'}`}
                  onClick={() => setConsultationStatusFilter(value)}
                >
                  {value === 'all' ? 'All' : value === 'pending' ? 'Pending' : 'Completed'}
                </button>
              ))}
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
                {filteredConsultations.map(c => (
                  <tr key={c.appointmentId}>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--primary)' }}>{c.patientName}</div>
                      </div>
                    </td>
                    <td><StatusPill value={c.status} /></td>
                    <td>
                      <div style={{ fontSize: '0.875rem' }}>{c.date}</div>
                      <div className="muted" style={{ fontSize: '0.75rem' }}>{c.hour}</div>
                    </td>
                    <td>
                      <button
                        className={`btn ${c.status !== 'COMPLETED' ? 'btn--secondary' : 'btn--ghost'}`}
                        onClick={() => navigateTo(`/app/doctor/consultations/${c.appointmentId}`)}
                      >
                        {c.status !== 'COMPLETED' ? 'Open Case' : 'Consult'}
                        <ExternalLink size={14} style={{ marginLeft: '4px' }} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredConsultations.length === 0 && (
                  <tr><td colSpan={4} className="muted" style={{ textAlign: 'center', padding: '2rem' }}>No consultations match the filter</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </article>
      )}
    </div>
  );
}
