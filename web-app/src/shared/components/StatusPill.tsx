interface StatusPillProps {
  value: string;
}

export function StatusPill({ value }: StatusPillProps) {
  const normalized = value.toLowerCase();
  let variant = 'pending';

  if (normalized === 'approved' || normalized === 'completed' || normalized === 'active') {
    variant = 'approved';
  } else if (normalized === 'rejected' || normalized === 'cancelled') {
    variant = 'rejected';
  }

  return (
    <span className={`badge badge--${variant}`}>
      {value}
    </span>
  );
}
