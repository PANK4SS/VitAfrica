import { useState } from 'react';
import { Mail, User, Lock, AlertCircle, CheckCircle2, ArrowLeft, ArrowRight, Camera, Eye, EyeOff } from 'lucide-react';
import { navigateTo } from '../../app/router';
import { authApi } from '../../core/api/authApi';
import { useAuth } from '../../core/auth/AuthContext';
import { compressImage } from '../../core/utils/image';

export function RegisterPage() {
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    setMessage('');
    setError('');
    setLoading(true);

    try {
      if (!profileFile) {
        throw new Error('Professional profile photo is required.');
      }

      // Client-side compression to avoid 413 Payload Too Large
      const compressedBlob = await compressImage(profileFile);
      const compressedFile = new File([compressedBlob], profileFile.name, { type: 'image/jpeg' });

      const upload = await authApi.uploadProfilePicture(compressedFile);
      const responseMessage = await register({
        ...form,
        profilePicUrl: upload.url,
      });
      setMessage(responseMessage || 'Access request submitted. An administrator will validate your professional credentials shortly.');
    } catch (err: any) {
      if (err?.status === 413) {
        setError('The image file is too large. Please try a smaller photo.');
      } else {
        setError(err?.message || 'Registration request failed. Please verify your details.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <article className="auth-card" style={{ maxWidth: '440px', padding: '1.5rem' }}>
        <header className="auth-card__logo" style={{ marginBottom: '1rem' }}>
          <img
            src="/logo.png"
            alt="VitAfrica"
            style={{ height: '72px', marginBottom: '1rem', cursor: 'pointer' }}
            onClick={() => navigateTo('/')}
          />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{message ? 'Success' : `Step ${step} of 2`}</h2>
          <p className="muted" style={{ fontSize: '0.8125rem' }}>
            {message ? 'Application sent' : step === 1 ? 'Credential details' : 'Professional identity'}
          </p>
        </header>

        {/* Stepper Indicator */}
        {!message && (
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ flex: 1, height: '3px', background: 'var(--secondary)', borderRadius: '2px' }} />
            <div style={{ flex: 1, height: '3px', background: step === 2 ? 'var(--secondary)' : 'var(--line)', borderRadius: '2px', transition: 'all 0.3s ease' }} />
          </div>
        )}

        {message && (
          <div className="alert alert--success" style={{ flexDirection: 'column', textAlign: 'center', padding: '1.5rem' }}>
            <CheckCircle2 size={40} style={{ marginBottom: '0.75rem' }} />
            <h4 style={{ marginBottom: '0.25rem' }}>Request Received</h4>
            <p style={{ fontSize: '0.8125rem', lineHeight: '1.4' }}>{message}</p>
            <button
              onClick={() => navigateTo('/login')}
              className="btn btn--primary"
              style={{ marginTop: '1.25rem', width: '100%', height: '40px' }}
            >
              Back to Sign In
            </button>
          </div>
        )}

        {error && (
          <div className="alert alert--error" style={{ padding: '0.75rem', marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.8125rem' }}>{error}</span>
          </div>
        )}

        {!message && (
          <form onSubmit={onSubmit} style={{ display: 'grid', gap: '0.75rem' }}>
            {step === 1 ? (
              <>
                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8125rem' }}>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                    <input
                      className="input-style"
                      style={{ paddingLeft: '2.5rem', height: '40px', fontSize: '0.875rem' }}
                      value={form.username}
                      onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                      type="text"
                      placeholder="e.g. Dr. Jane Doe"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8125rem' }}>Work Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                    <input
                      className="input-style"
                      style={{ paddingLeft: '2.5rem', height: '40px', fontSize: '0.875rem' }}
                      value={form.email}
                      onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                      type="email"
                      placeholder="name@vitafrica.com"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8125rem' }}>Security Password</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }} />
                    <input
                      className="input-style"
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', height: '40px', fontSize: '0.875rem' }}
                      value={form.password}
                      onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--ink-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '4px'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '3px solid var(--secondary)',
                    overflow: 'hidden',
                    background: 'var(--surface-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <User size={40} className="muted" />
                    )}
                  </div>
                  <label style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    background: 'var(--primary)',
                    color: 'white',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-md)'
                  }}>
                    <Camera size={16} />
                    <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                  </label>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.9375rem' }}>Upload photo</p>
                  <p className="muted" style={{ fontSize: '0.75rem' }}>Required for professional verification.</p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
              {step === 2 && (
                <button type="button" className="btn btn--ghost" onClick={() => setStep(1)} style={{ flex: 1, height: '40px', fontSize: '0.875rem' }}>
                  Back
                </button>
              )}
              <button type="submit" className="btn btn--secondary" disabled={loading} style={{ flex: 2, height: '40px', fontSize: '0.875rem' }}>
                {loading ? 'Submitting...' : step === 1 ? (
                  <>Next Step <ArrowRight size={16} /></>
                ) : (
                  'Submit Request'
                )}
              </button>
            </div>
          </form>
        )}

        {!message && (
          <button
            onClick={() => navigateTo('/login')}
            className="btn btn--ghost"
            style={{ width: '100%', fontSize: '0.8125rem', fontWeight: 700, marginTop: '0.5rem', height: '36px' }}
          >
            <ArrowLeft size={16} /> Back to Sign In
          </button>
        )}
      </article>
    </section>
  );
}
