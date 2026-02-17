import { useState } from 'react';
import {
    LogIn, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff,
    User, Camera, CheckCircle2, ArrowLeft,
} from 'lucide-react';
import { navigateTo } from '../../app/router';
import { useAuth } from '../../core/auth/AuthContext';
import { authApi } from '../../core/api/authApi';
import { compressImage } from '../../core/utils/image';
import vitaAuthImg from '../../assets/vitaAuth .png';

interface AuthPageProps {
    initialMode?: 'login' | 'register';
}

export function AuthPage({ initialMode = 'login' }: AuthPageProps) {
    const [mode, setMode] = useState<'login' | 'register'>(initialMode);

    const switchMode = (newMode: 'login' | 'register') => {
        setMode(newMode);
        navigateTo(newMode === 'login' ? '/login' : '/register');
    };

    return (
        <section className="auth-page-wrapper">
            <div className={`auth-container ${mode === 'register' ? 'auth-container--register' : ''}`}>
                {/* Image Panel */}
                <div className={`auth-image-panel ${mode === 'register' ? 'auth-image-panel--right' : ''}`}>
                    <img src={vitaAuthImg} alt="VitAfrica" className="auth-image-panel__img" />
                </div>

                {/* Form Panel */}
                <div className={`auth-form-panel ${mode === 'register' ? 'auth-form-panel--left' : ''}`}>
                    {mode === 'login' ? (
                        <LoginForm onSwitch={() => switchMode('register')} />
                    ) : (
                        <RegisterForm onSwitch={() => switchMode('login')} />
                    )}
                </div>
            </div>
        </section>
    );
}

/* ─────────────── LOGIN FORM ─────────────── */

function LoginForm({ onSwitch }: { onSwitch: () => void }) {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const role = await login({ email, password });
            const target =
                role === 'ADMIN'
                    ? '/app/admin'
                    : role === 'STAFF'
                        ? '/app/staff'
                        : role === 'DOCTOR'
                            ? '/app/doctor'
                            : '/app/unknown-role';
            navigateTo(target);
        } catch (err: any) {
            setError(err?.message || 'Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-form-content" key="login">
            <header className="auth-form-header">
                <h2>Welcome Back</h2>
                <p className="muted">Administrative Portal Access</p>
            </header>

            {error && (
                <div className="alert alert--error" style={{ padding: '0.75rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={16} />
                    <span style={{ fontSize: '0.8125rem' }}>{error}</span>
                </div>
            )}

            <form onSubmit={onSubmit} className="auth-form">
                <div className="form-group">
                    <label className="form-label" htmlFor="login-email">EMAIL ADDRESS</label>
                    <div className="auth-input-wrap">
                        <Mail size={16} className="auth-input-icon" />
                        <input
                            id="login-email"
                            className="input-style"
                            style={{ paddingLeft: '2.5rem', height: '44px' }}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            placeholder="doctor@vitafrica.com"
                            required
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label className="form-label" htmlFor="login-password">PASSWORD</label>
                    <div className="auth-input-wrap">
                        <Lock size={16} className="auth-input-icon" />
                        <input
                            id="login-password"
                            className="input-style"
                            style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', height: '44px' }}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            minLength={8}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="auth-eye-btn"
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <button type="submit" className="btn btn--secondary auth-submit-btn" disabled={loading}>
                    {loading ? 'Authenticating...' : (
                        <>
                            <LogIn size={18} />
                            Sign In to Portal
                        </>
                    )}
                </button>
            </form>

            <footer className="auth-form-footer">
                <span className="muted">New professional user?</span>
                <button onClick={onSwitch} className="auth-link-btn">
                    Create Account <ArrowRight size={14} />
                </button>
            </footer>
        </div>
    );
}

/* ─────────────── REGISTER FORM ─────────────── */

function RegisterForm({ onSwitch }: { onSwitch: () => void }) {
    const { register } = useAuth();
    const [step, setStep] = useState(1);
    const [form, setForm] = useState({ email: '', username: '', password: '' });
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
            reader.onloadend = () => setPreviewUrl(reader.result as string);
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
        <div className="auth-form-content" key="register">
            <header className="auth-form-header">
                <h2>{message ? 'Success' : `Step ${step} of 2`}</h2>
                <p className="muted">
                    {message ? 'Application sent' : step === 1 ? 'Credential details' : 'Professional identity'}
                </p>
            </header>

            {/* Stepper */}
            {!message && (
                <div className="auth-stepper">
                    <div className="auth-stepper__bar auth-stepper__bar--active" />
                    <div className={`auth-stepper__bar ${step === 2 ? 'auth-stepper__bar--active' : ''}`} />
                </div>
            )}

            {message && (
                <div className="alert alert--success" style={{ flexDirection: 'column', textAlign: 'center', padding: '1.5rem' }}>
                    <CheckCircle2 size={40} style={{ marginBottom: '0.75rem' }} />
                    <h4 style={{ marginBottom: '0.25rem' }}>Request Received</h4>
                    <p style={{ fontSize: '0.8125rem', lineHeight: '1.4' }}>{message}</p>
                    <button
                        onClick={() => { navigateTo('/login'); onSwitch(); }}
                        className="btn btn--primary"
                        style={{ marginTop: '1.25rem', width: '100%', height: '40px' }}
                    >
                        Back to Sign In
                    </button>
                </div>
            )}

            {error && (
                <div className="alert alert--error" style={{ padding: '0.75rem', marginBottom: '0.5rem' }}>
                    <AlertCircle size={16} />
                    <span style={{ fontSize: '0.8125rem' }}>{error}</span>
                </div>
            )}

            {!message && (
                <form onSubmit={onSubmit} className="auth-form">
                    {step === 1 ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">FULL NAME</label>
                                <div className="auth-input-wrap">
                                    <User size={16} className="auth-input-icon" />
                                    <input
                                        className="input-style"
                                        style={{ paddingLeft: '2.5rem', height: '44px' }}
                                        value={form.username}
                                        onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                                        type="text"
                                        placeholder="e.g. Dr. Jane Doe"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">WORK EMAIL</label>
                                <div className="auth-input-wrap">
                                    <Mail size={16} className="auth-input-icon" />
                                    <input
                                        className="input-style"
                                        style={{ paddingLeft: '2.5rem', height: '44px' }}
                                        value={form.email}
                                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                                        type="email"
                                        placeholder="name@vitafrica.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">SECURITY PASSWORD</label>
                                <div className="auth-input-wrap">
                                    <Lock size={16} className="auth-input-icon" />
                                    <input
                                        className="input-style"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', height: '44px' }}
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
                                        className="auth-eye-btn"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
                            <div style={{ position: 'relative' }}>
                                <div className="auth-avatar-ring">
                                    {previewUrl ? (
                                        <img src={previewUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <User size={40} className="muted" />
                                    )}
                                </div>
                                <label className="auth-avatar-btn">
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
                            <button type="button" className="btn btn--ghost" onClick={() => setStep(1)} style={{ flex: 1, height: '44px' }}>
                                Back
                            </button>
                        )}
                        <button type="submit" className="btn btn--secondary auth-submit-btn" disabled={loading} style={{ flex: 2 }}>
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
                <footer className="auth-form-footer">
                    <button onClick={onSwitch} className="auth-link-btn">
                        <ArrowLeft size={16} /> Back to Sign In
                    </button>
                </footer>
            )}
        </div>
    );
}
