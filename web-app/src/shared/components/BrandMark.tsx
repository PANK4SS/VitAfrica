import logo from '../../assets/branding/app_logo.svg';

interface BrandMarkProps {
  compact?: boolean;
}

export function BrandMark({ compact = false }: BrandMarkProps) {
  return (
    <div className={`brand-mark ${compact ? 'brand-mark--compact' : ''}`}>
      <img src={logo} alt="VitAfrica" className="brand-mark__logo" />
      {!compact && (
        <div>
          <p className="brand-mark__title">VitAfrica</p>
          <p className="brand-mark__subtitle">Healthcare Digital Platform</p>
        </div>
      )}
    </div>
  );
}
