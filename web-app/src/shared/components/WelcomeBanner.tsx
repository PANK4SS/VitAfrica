interface WelcomeBannerProps {
  role: 'ADMIN' | 'STAFF' | 'DOCTOR';
  name: string;
  text: string;
}

import adminSvg from '../../assets/undraw_medical-research_pze7.svg';
import staffSvg from '../../assets/undraw_doctors_djoj.svg';
import doctorSvg from '../../assets/undraw_medical-care_7m9g.svg';

const roleConfig = {
  ADMIN: {
    workspace: 'Admin Workspace',
    asset: adminSvg,
  },
  STAFF: {
    workspace: 'Staff Workspace',
    asset: staffSvg,
  },
  DOCTOR: {
    workspace: 'Doctor Workspace',
    asset: doctorSvg,
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
        <img
          src={config.asset}
          alt=""
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}
