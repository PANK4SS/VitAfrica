interface WelcomeBannerProps {
  role: 'ADMIN' | 'STAFF' | 'DOCTOR';
  name: string;
  text: string;
}

const roleConfig = {
  ADMIN: {
    svg: `<circle cx="150" cy="100" r="80" fill="#ffffff" fill-opacity="0.1"/><path d="M100,160 L100,100 L160,60 L220,100 L220,160 L160,200 Z" fill="none" stroke="#b9fa3c" stroke-width="4"/><circle cx="160" cy="130" r="20" fill="#b9fa3c"/>`,
    workspace: 'Admin Workspace',
  },
  STAFF: {
    svg: `<rect x="120" y="40" width="80" height="120" rx="10" fill="none" stroke="#b9fa3c" stroke-width="4"/><line x1="140" y1="70" x2="180" y2="70" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/><line x1="140" y1="100" x2="180" y2="100" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/><circle cx="80" cy="140" r="30" fill="#b9fa3c" opacity="0.8"/>`,
    workspace: 'Staff Workspace',
  },
  DOCTOR: {
    svg: `<path d="M80,100 Q80,50 130,50 T180,100 V140" fill="none" stroke="#b9fa3c" stroke-width="6" stroke-linecap="round"/><circle cx="180" cy="150" r="15" fill="#ffffff"/><circle cx="80" cy="100" r="5" fill="#b9fa3c"/>`,
    workspace: 'Doctor Workspace',
  },
};

export function WelcomeBanner({ role, name, text }: WelcomeBannerProps) {
  const config = roleConfig[role];

  return (
    <div
      style={{
        width: '100%',
        background: 'linear-gradient(to right, var(--primary), #0a0a85)',
        borderRadius: '1.5rem',
        padding: '1.25rem 1.5rem',
        marginBottom: '2rem',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 10px 25px rgba(4, 4, 94, 0.2)',
      }}
    >
      {/* Decor */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '16rem',
          height: '16rem',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '50%',
          marginRight: '-2.5rem',
          marginTop: '-2.5rem',
          filter: 'blur(2rem)',
        }}
      />

      <div style={{ zIndex: 10, maxWidth: '32rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span
            style={{
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--secondary)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {config.workspace}
          </span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
            fontWeight: 700,
            color: 'white',
            marginBottom: '0.375rem',
            lineHeight: 1.2,
          }}
        >
          Welcome back, <span style={{ color: 'var(--secondary)' }}>{name}</span>!
        </h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '1rem', fontWeight: 300, lineHeight: 1.5 }}>
          {text}
        </p>
      </div>

      {/* Illustration Vectorielle */}
      <div
        style={{
          width: '16rem',
          height: '10rem',
          position: 'relative',
          zIndex: 10,
          display: 'none',
        }}
        className="welcome-illustration"
      >
        <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' }} dangerouslySetInnerHTML={{ __html: config.svg }} />
      </div>
    </div>
  );
}
