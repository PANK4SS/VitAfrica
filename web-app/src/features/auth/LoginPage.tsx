import { useState } from 'react';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { navigateTo } from '../../app/router';
import { useAuth } from '../../core/auth/AuthContext';

export function LoginPage() {
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
      const message = err?.message || 'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="auth-page">
      <article className="auth-card" style={{ maxWidth: '400px', padding: '1.5rem' }}>
        <header className="auth-card__logo" style={{ marginBottom: '1.25rem' }}>
          <img
            src="/logo.png"
            alt="VitAfrica"
            style={{ height: '72px', marginBottom: '1rem', cursor: 'pointer' }}
            onClick={() => navigateTo('/')}
          />
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>Welcome Back</h2>
          <p className="muted" style={{ fontSize: '0.8125rem' }}>Administrative Portal Access</p>
        </header>

        {error && (
          <div className="alert alert--error" style={{ padding: '0.75rem', marginBottom: '1rem' }}>
            <AlertCircle size={16} />
            <span style={{ fontSize: '0.8125rem' }}>{error}</span>
          </div>
        )}

        <form onSubmit={onSubmit} style={{ display: 'grid', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8125rem' }} htmlFor="email">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }}
              />
              <input
                id="email"
                className="input-style"
                style={{ paddingLeft: '2.5rem', height: '40px', fontSize: '0.875rem' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="doctor@vitafrica.com"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ marginBottom: '0.25rem', fontSize: '0.8125rem' }} htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)' }}
              />
              <input
                id="password"
                className="input-style"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem', height: '40px', fontSize: '0.875rem' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                minLength={8}
                required
              />
              <button
                type="button"
                className="password-toggle"
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

          <button type="submit" className="btn btn--secondary" disabled={loading} style={{ marginTop: '0.5rem', height: '40px', fontSize: '0.875rem' }}>
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} />
                Sign In to Portal
              </>
            )}
          </button>
        </form>

        <footer style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8125rem' }}>
          <span className="muted">New professional user?</span>{' '}
          <button
            onClick={() => navigateTo('/register')}
            className="btn btn--ghost"
            style={{ padding: '0.25rem 0.5rem', height: 'auto', verticalAlign: 'baseline', fontWeight: 700 }}
          >
            Create Account <ArrowRight size={14} style={{ marginLeft: '4px' }} />
          </button>
        </footer>
      </article>
    </section>
  );
}
