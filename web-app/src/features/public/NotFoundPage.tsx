import { AlertCircle, Home, ArrowLeft } from 'lucide-react';
import { navigateTo } from '../../app/router';

interface NotFoundPageProps {
  title?: string;
  description?: string;
}

export function NotFoundPage({
  title = 'Page not found',
  description = 'The requested route does not exist or has been relocated within the clinical system.',
}: NotFoundPageProps) {
  return (
    <section className="auth-page">
      <article className="auth-card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'var(--danger-soft)',
          color: 'var(--danger)',
          borderRadius: '50%',
          display: 'grid',
          placeItems: 'center',
          margin: '0 auto 1.5rem'
        }}>
          <AlertCircle size={32} />
        </div>

        <h2 style={{ marginBottom: '0.75rem' }}>{title}</h2>
        <p className="muted" style={{ marginBottom: '2rem', maxWidth: '300px', marginInline: 'auto' }}>
          {description}
        </p>

        <div style={{ display: 'grid', gap: '0.75rem' }}>
          <button type="button" className="btn btn--primary" onClick={() => navigateTo('/')}>
            <Home size={18} />
            Clinical Home
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => window.history.back()}>
            <ArrowLeft size={18} />
            Go Back
          </button>
        </div>
      </article>
    </section>
  );
}
