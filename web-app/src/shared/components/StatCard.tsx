import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: {
    value: string;
    isUp: boolean;
  };
}

export function StatCard({ label, value, icon: Icon, color, trend }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-card__info">
        <p>{label}</p>
        <h3>{value}</h3>
        {trend && (
          <p style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            marginTop: '0.5rem',
            color: trend.isUp ? 'var(--success)' : 'var(--danger)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem'
          }}>
            {trend.isUp ? '↑' : '↓'} {trend.value}
          </p>
        )}
      </div>
      <div className="stat-card__icon" style={color ? { color, background: `${color}15` } : {}}>
        <Icon size={24} />
      </div>
    </article>
  );
}
