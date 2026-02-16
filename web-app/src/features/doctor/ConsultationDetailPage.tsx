import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ClipboardList,
  Beaker,
  CheckCircle2,
  Upload,
  AlertCircle,
  FileText
} from 'lucide-react';
import { navigateTo } from '../../app/router';
import { doctorApi } from '../../core/api/doctorApi';
import { useAuth } from '../../core/auth/AuthContext';
import type { ConsultationDetailResponse } from '../../core/types/api';
import { StatusPill } from '../../shared/components/StatusPill';
import { ProfileAvatar } from '../../shared/components/ProfileAvatar';

interface ConsultationDetailPageProps {
  appointmentId: number;
}

export function ConsultationDetailPage({ appointmentId }: ConsultationDetailPageProps) {
  const { session } = useAuth();

  const [detail, setDetail] = useState<ConsultationDetailResponse | null>(null);
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [durationDays, setDurationDays] = useState('1');
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const token = session.accessToken;

    async function load() {
      setLoading(true);
      try {
        const data = await doctorApi.getConsultationDetail(token, appointmentId);
        setDetail(data);
      } catch (err) {
        setError('Clinical file could not be retrieved.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [session, appointmentId]);

  async function addPrescription(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) return;
    const token = session.accessToken;

    try {
      await doctorApi.addPrescription(token, appointmentId, {
        patientId: appointmentId,
        drugs: [
          {
            drugName,
            dosage,
            frequency,
            durationDays: Number(durationDays),
          },
        ],
      });
      setMessage('Prescription successfully registered.');
      setTimeout(() => setMessage(''), 3000);
      setDrugName('');
      setDosage('');
      setFrequency('');
      setDurationDays('1');
    } catch (err) {
      setError('Prescription error.');
    }
  }

  async function uploadResult() {
    if (!session || !file) return;
    const token = session.accessToken;

    try {
      await doctorApi.uploadLabResult(token, appointmentId, file);
      setMessage('Diagnostic report successfully uploaded.');
      setTimeout(() => setMessage(''), 3000);
      setFile(null);
    } catch (err) {
      setError('Upload failure.');
    }
  }

  async function completeConsultation() {
    if (!session) return;
    const token = session.accessToken;
    try {
      await doctorApi.completeConsultation(token, appointmentId);
      setMessage('Case closed successfully.');
      setTimeout(() => navigateTo('/app/doctor'), 1500);
    } catch (err) {
      setError('Close operation failed.');
    }
  }

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="spinner" />
        <p>Retrieving clinical records...</p>
      </div>
    );
  }

  return (
    <section className="page-grid">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            onClick={() => navigateTo('/app/doctor')}
            className="btn btn--ghost"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="page-title">
            <h1>Consultation Record #{appointmentId}</h1>
          </div>
        </div>
      </header>

      {message && (
        <div className="alert alert--success">
          <CheckCircle2 size={18} />
          {message}
        </div>
      )}

      {error && (
        <div className="alert alert--error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <div className="grid-2">
        <article className="table-card">
          <div className="table-header">
            <h3><User size={18} /> Patient Information</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            {detail ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)', paddingBottom: '0.5rem' }}>
                  <span className="muted">Full Name</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <ProfileAvatar src={detail.patientProfilePic} alt={detail.patientName} size={30} />
                    {detail.patientName}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)', paddingBottom: '0.5rem' }}>
                  <span className="muted">Contact</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Phone size={14} className="muted" />
                    <span>{detail.patientPhone}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)', paddingBottom: '0.5rem' }}>
                  <span className="muted">Address</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <MapPin size={14} className="muted" />
                    <span>{detail.patientLocation}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)', paddingBottom: '0.5rem' }}>
                  <span className="muted">Schedule</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> {detail.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {detail.hour}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="muted">Clinical Status</span>
                  <StatusPill value={detail.status} />
                </div>
              </>
            ) : (
              <p className="muted">Loading patient profile...</p>
            )}
          </div>
        </article>

        <div style={{ display: 'grid', gap: '1.5rem' }}>
          <article className="table-card">
            <div className="table-header">
              <h3><ClipboardList size={18} /> Medical Prescription</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <form onSubmit={addPrescription} style={{ display: 'grid', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Drug Name</label>
                  <input
                    className="input-style"
                    placeholder="e.g. Paracetamol 500mg"
                    value={drugName}
                    onChange={(e) => setDrugName(e.target.value)}
                    required
                  />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Dosage</label>
                    <input
                      className="input-style"
                      placeholder="e.g. 1 tablet"
                      value={dosage}
                      onChange={(e) => setDosage(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Frequency</label>
                    <input
                      className="input-style"
                      placeholder="e.g. 2 times/day"
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration (days)</label>
                  <input
                    className="input-style"
                    type="number"
                    min="1"
                    value={durationDays}
                    onChange={(e) => setDurationDays(e.target.value)}
                    required
                  />
                </div>
                <button className="btn btn--secondary" type="submit" style={{ width: '100%' }}>
                  <FileText size={18} />
                  Authorize Prescription
                </button>
              </form>
            </div>
          </article>

          <article className="table-card">
            <div className="table-header">
              <h3><Beaker size={18} /> Laboratory Results</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <label className="input-style" style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', overflow: 'hidden' }}>
                  <Upload size={16} className="muted" />
                  <span className="muted" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    {file ? file.name : 'Select clinical report...'}
                  </span>
                  <input type="file" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>
                <button type="button" className="btn btn--primary" onClick={() => void uploadResult()} disabled={!file}>
                  Upload
                </button>
              </div>
            </div>
          </article>

          <article className="table-card" style={{ background: 'var(--primary-dark)', color: 'white' }}>
            <div className="table-header" style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: 'white' }}><CheckCircle2 size={18} /> Conclusion</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', marginBottom: '1rem', opacity: 0.8 }}>Verify all documentation before closing the consultation file.</p>
              <button
                type="button"
                className="btn btn--secondary"
                style={{ width: '100%' }}
                onClick={() => void completeConsultation()}
                disabled={detail?.status === 'COMPLETED'}
              >
                {detail?.status === 'COMPLETED' ? 'Consultation Finalized' : 'Finalize & Archive Case'}
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
