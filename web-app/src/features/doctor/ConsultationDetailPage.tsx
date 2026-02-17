import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ClipboardList,
  Beaker,
  CheckCircle2,
  Upload,
  AlertCircle,
  FileText,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { navigateTo } from '../../app/router';
import { doctorApi } from '../../core/api/doctorApi';
import { useAuth } from '../../core/auth/AuthContext';
import type {
  ConsultationDetailResponse,
  DrugRequest,
  LabResultResponse,
  PrescriptionResponse,
} from '../../core/types/api';
import { resolveImageUrl } from '../../core/utils/image';
import { StatusPill } from '../../shared/components/StatusPill';
import { ProfileAvatar } from '../../shared/components/ProfileAvatar';

interface ConsultationDetailPageProps {
  appointmentId: number;
}

export function ConsultationDetailPage({ appointmentId }: ConsultationDetailPageProps) {
  const { session } = useAuth();

  const [detail, setDetail] = useState<ConsultationDetailResponse | null>(null);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [drugName, setDrugName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [durationDays, setDurationDays] = useState('1');
  const [pendingDrugs, setPendingDrugs] = useState<DrugRequest[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [prescriptionHistory, setPrescriptionHistory] = useState<PrescriptionResponse[]>([]);
  const [labResultHistory, setLabResultHistory] = useState<LabResultResponse[]>([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    const token = session.accessToken;

    async function load() {
      setLoading(true);
      try {
        const [detailData, prescriptionsData, labResultsData] = await Promise.all([
          doctorApi.getConsultationDetail(token, appointmentId),
          doctorApi.getPrescriptionHistory(token, appointmentId).catch(() => []),
          doctorApi.getLabResultHistory(token, appointmentId).catch(() => []),
        ]);
        setDetail(detailData);
        setPrescriptionHistory(prescriptionsData);
        setLabResultHistory(labResultsData);
      } catch (err) {
        setError('Clinical file could not be retrieved.');
      } finally {
        setLoading(false);
      }
    }

    void load();
  }, [session, appointmentId]);

  function addDrugToPending(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!drugName.trim()) return;
    setPendingDrugs((prev) => [
      ...prev,
      { drugName: drugName.trim(), dosage: dosage.trim(), frequency: frequency.trim(), durationDays: Number(durationDays) || 1 },
    ]);
    setDrugName('');
    setDosage('');
    setFrequency('');
    setDurationDays('1');
  }

  function removePendingDrug(index: number) {
    setPendingDrugs((prev) => prev.filter((_, i) => i !== index));
  }

  async function validatePrescription() {
    if (!session || pendingDrugs.length === 0) return;
    const token = session.accessToken;
    try {
      await doctorApi.addPrescription(token, appointmentId, {
        patientId: appointmentId,
        drugs: pendingDrugs,
      });
      setMessage('Prescription successfully registered.');
      setTimeout(() => setMessage(''), 3000);
      setPendingDrugs([]);
      const prescriptionsData = await doctorApi.getPrescriptionHistory(token, appointmentId);
      setPrescriptionHistory(prescriptionsData);
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
      const labResultsData = await doctorApi.getLabResultHistory(token, appointmentId);
      setLabResultHistory(labResultsData);
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
      setTimeout(() => navigateTo('/app/doctor?tab=consultations'), 1500);
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
            onClick={() => navigateTo('/app/doctor?tab=consultations')}
            className="btn btn--ghost"
            style={{ padding: '0.5rem', borderRadius: '50%' }}
          >
            <ArrowLeft size={20} />
          </button>
          <div className="page-title">
            <h1>Consultation Record</h1>
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
            <h3>Patient Information</h3>
          </div>
          <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
            {detail ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ProfileAvatar src={detail.patientProfilePic} alt={detail.patientName} size={56} />
                  <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>{detail.patientName}</span>
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
                  <span className="muted">Last Schedule</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Calendar size={14} /> {detail.date}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><Clock size={14} /> {detail.hour}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--line-soft)', paddingBottom: '0.5rem' }}>
                  <span className="muted">Consultation Status</span>
                  <StatusPill value={detail.status} />
                </div>
                {detail.status !== 'COMPLETED' && (
                  <button
                    type="button"
                    className="btn btn--secondary"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                    onClick={() => void completeConsultation()}
                  >
                    Mark as Complete
                  </button>
                )}
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
            <div style={{ padding: '1.5rem', display: 'grid', gap: '1rem' }}>
              {detail?.status !== 'COMPLETED' && (
                <>
                  <div className="form-group">
                    <label className="form-label">Consultation Notes</label>
                    <textarea
                      className="input-style"
                      placeholder="e.g. Receive today for stomach ache..."
                      value={consultationNotes}
                      onChange={(e) => setConsultationNotes(e.target.value)}
                      rows={3}
                      style={{ resize: 'vertical' }}
                    />
                  </div>
                  <form onSubmit={addDrugToPending} style={{ display: 'grid', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Drug Name</label>
                    <input
                      className="input-style"
                      placeholder="e.g. Paracetamol 500mg"
                      value={drugName}
                      onChange={(e) => setDrugName(e.target.value)}
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
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Frequency</label>
                      <input
                        className="input-style"
                        placeholder="e.g. 2 times/day"
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
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
                    />
                  </div>
                  <button type="submit" className="btn btn--ghost" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', border: '2px solid var(--primary)' }}>
                    <Plus size={18} /> Add drug
                  </button>
                </form>
                </>
              )}

              {detail?.status !== 'COMPLETED' && pendingDrugs.length > 0 && (
                <>
                  <div style={{ borderTop: '1px solid var(--line-soft)', paddingTop: '1rem' }}>
                    <p className="form-label" style={{ marginBottom: '0.5rem' }}>Current prescription (not yet validated)</p>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                      {pendingDrugs.map((d, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--surface-muted)', borderRadius: '6px' }}>
                          <span style={{ fontSize: '0.875rem' }}>{d.drugName} — {d.dosage}, {d.frequency}, {d.durationDays} day(s)</span>
                          <button type="button" className="btn btn--ghost" style={{ padding: '0.25rem' }} onClick={() => removePendingDrug(i)} aria-label="Remove">
                            <Trash2 size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button type="button" className="btn btn--secondary" style={{ width: '100%' }} onClick={() => void validatePrescription()}>
                    <FileText size={18} />
                    Validate Prescription
                  </button>
                </>
              )}
            </div>
          </article>

          <article className="table-card">
            <div className="table-header">
              <h3><Beaker size={18} /> Laboratory Results</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
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
              {labResultHistory.length > 0 && (
                <div>
                  <p className="form-label" style={{ marginBottom: '0.5rem' }}>Document history</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '0.5rem' }}>
                    {labResultHistory.map((lab) => (
                      <li key={lab.labResultId} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem', background: 'var(--surface-muted)', borderRadius: '6px' }}>
                        <span style={{ fontSize: '0.875rem' }}>{lab.fileName} — {lab.uploadedAt}</span>
                        <a href={resolveImageUrl(lab.fileUrl) ?? lab.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn--ghost" style={{ padding: '0.25rem' }}>
                          <ExternalLink size={16} />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </article>

          {prescriptionHistory.length > 0 && (
            <article className="table-card">
              <div className="table-header">
                <h3><ClipboardList size={18} /> Prescription history</h3>
              </div>
              <div style={{ padding: '1.5rem' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: '1rem' }}>
                  {prescriptionHistory.map((p) => (
                    <li key={p.prescriptionId} style={{ padding: '1rem', background: 'var(--surface-muted)', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginBottom: '0.5rem' }}>
                        {p.date} — {p.doctorName} ({p.doctorDepartment})
                      </div>
                      <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
                        {p.drugs.map((d, i) => (
                          <li key={i} style={{ fontSize: '0.875rem' }}>{d.drugName}: {d.dosage}, {d.frequency}, {d.durationDays}</li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          )}

          <article className="table-card" style={{ background: 'var(--primary-dark)', color: 'white' }}>
            <div className="table-header" style={{ borderBottomColor: 'rgba(255,255,255,0.1)' }}>
              <h3 style={{ color: 'white' }}><CheckCircle2 size={18} /> Finalization</h3>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Verify all documentation before closing the consultation file.</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
